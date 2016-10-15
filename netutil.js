"use strict";

const logger=require("./log.js");
const fs = require("fs");
const os = require("os");
const dgram = require('dgram');
const net = require('net');
const Buffer = require('buffer').Buffer;
const cp = require('child_process');
const tcpp = require('tcp-ping');
const util = require('util');

const IPV4 = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/;
const MAC = /([0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2})/;
const INCOMLITE = /([0:\-]{11,17}|incomplete|unreachable)/;

const MAC_SIZE = 6;
const MAGIC_WORD_SIZE = (1 + 16) * MAC_SIZE;

const ARP_FILE = "/proc/net/arp";

var findPattern = (pattern, str) => (pattern.exec(str) || [null])[0];

var createMagicPacket = (macStr) => {
    const buffer = Buffer.alloc(MAGIC_WORD_SIZE, 0xff);
    const macBuf = Buffer.from(macStr.split(":").map((s) => {
        return parseInt(s, 16);
    }));
    for (let i = MAC_SIZE; i < buffer.length; i += MAC_SIZE) {
        macBuf.copy(buffer, i);
    }
    return buffer;
};

var createSocket = (address, config) => {
    logger.debug(`creating socket ${JSON.stringify(address)}, ${config.bindPort}, ${config.bindAddress}`);
    const socket = dgram.createSocket('udp4'); //net.isIPv6(address.destination) ? 'udp6' :
    return new Promise((resolve, reject) => {
        socket.bind(config.bindPort, config.bindAddress);
        socket.once('listening', () => {
            socket.setBroadcast(true);
            logger.debug(`socket ${JSON.stringify(address)} was created`);
            resolve(socket)
        });
        socket.on('error', (error) => {
            logger.error(JSON.stringify(error));
            socket.close();
            reject(error)
        });
    });
    //return Promise.resolve(socket);
};

var sleep = (sleepTime) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("ready");
        }, sleepTime)
    });
};

var series = (func, count, sleepTime) => {
    if (count < 1) return Promise.resolve();
    var p = func();
    for (let i = 0; i < (count - 1); ++i) {
        p = p.then(() => {
            return sleep(sleepTime);
        }).then(() => {
            return func();
        });
    }
    return p;
};

var createSendFunction = (magicPacket, address, socket) => {
    return () => {
        return new Promise((resolve, reject) => {
            logger.info(`sending wol packet to ${JSON.stringify(address)}`);
            socket.send(magicPacket, 0, magicPacket.length, address.port, address.destination, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            });
        });
    }
};

class NetUtil {

    /**
     * Read ARP Cache (/opt/net/arp)
     * @returns Array of ARP Records
     */
    readARP() {
        try {
            var content = fs.readFileSync(ARP_FILE, 'utf8');
            return content
                .split(os.EOL)
                .map((line) => {
                    let ip = findPattern(IPV4, line);
                    if (!ip) return null;
                    let mac = findPattern(MAC, line);
                    if (!mac) return null;
                    return ( findPattern(INCOMLITE, line) ) ? null : {ip: ip, mac: mac};
                }).filter((line) => line != null);
        } catch (err) {
            logger.error(err);
            return [];
        }
    };

    pingAll(machines) {
        return Promise.all(machines.map( (m) => { return this.ping(m) }));
    }

    /**
     * Check if host is up
     Two steps ping:
     1) if ssh available
     2) normal ping
     * @returns Promise
     **/
    ping(machine) {
        return new Promise((resolve, reject) => {
            tcpp.probe(machine.ipaddress, machine.sshPort, (err, available) => {
                //console.log(`${machine.destination} - ssh ${available}`);
                if (err) {
                    logger.error(err);
                    resolve({name:machine.name, sshStatus: false})
                } else {
                    resolve({name:machine.name, sshStatus: available})
                }
            });
        }).then((res) => {
            var args = ["-q", "-n", "-w 2", "-c 1", machine.ipaddress];
            return new Promise((resolve, reject) => {
                var ps = cp.spawn('/bin/ping', args);
                ps.on('error', (e) => {
                    logger.error(e);
                    res.pingStatus = false;
                    resolve(res);
                });
                ps.on('exit', (code) => {
                    res.pingStatus = (code == 0);
                    resolve(res);
                });
            });
        })
    }

    /**
     * Send wake on lan packet
     * @param machines as array of machines structure {mac, destination, port}
     * @param config as configuration
     * @returns Promise
     */
    wakeAll(machines, config) {
        logger.info(`wake all ${util.inspect(machines)}`);
        return machines.reduce( (pre, cur) => {
            return pre.then( (err) => {
                return ( err ) ? err : this.wake(cur, config)
            })
        }, Promise.resolve());
    };

    /**
     * Send wake on lan packet
     * @param address as a structure {mac, destination, port}
     * @param config as configuration
     * @returns Promise
     */
    wake(address, config) {
        const magicPacket = createMagicPacket(address.mac);
        var socket;
        return createSocket(address.destination, config).then((s) => {
            socket = s;
            logger.debug("socket created");
            const sendPackage = createSendFunction(magicPacket, address, socket);
            return series(sendPackage, config.pocketNum, config.pocketInterval);
        }).catch((err) => {
            return err;
        }).then((err) => {
            if (socket) {
                socket.close();
            }
            return err;
        })
    };


}

module.exports = () => {
    return new NetUtil();
};
