const Client = require('ssh2').Client;
const fs = require('fs');

const SLEEP = Symbol("sleep");
const RESET = Symbol("reset");
const HIBERNATE = Symbol("hibernate");
const SHUTDOWN = Symbol("shutdown");

class SSHUtil {
    constructor() { //TODO: config on constructor + observable
    }
    
    get SLEEP() { return SLEEP; }
    get RESET() { return RESET; }
    get HIBERNATE() { return HIBERNATE; }
    get SHUTDOWN() { return SHUTDOWN; }

    op(operation, machines, config) {
        switch (operation) {
            case SLEEP:
                return this.sleep(machines, config);
            case SHUTDOWN:
                return this.shutdown(machines, config);
            case RESET:
                return this.reset(machines, config);
            case HIBERNATE:
                return this.hibernate(machines, config);
            default:
                return Promise.reject(`Unknown operation ${operation}`);
        }
    }

    sleep(machines, config) {
        return this.executeAll('sudo pm-suspend', machines, config);
    }

    shutdown(machines, config) {
        return this.executeAll('sudo poweroff', machines, config);
    }

    hibernate(machines, config) {
        return this.executeAll('sudo pm-hibernate', machines, config);
    }

    reset(machines, config) {
        return this.executeAll('sudo reboot', machines, config);
    }

    executeAll(command, machines, config) {
        let arr = ( machines instanceof Array ) ? machines : ( ( machines ) ? [machines] : [] );
        if ( arr.length == 0 ) return Promise.resolve("");
        return arr.map( (m) => { return this.execute(command, m, config);});
    }

    execute(command, machine, config) {
        //console.log(config);
        var conn = new Client();
        return new Promise( (resolve, reject) => {
            conn.on('ready', function() {
                console.log('Client :: ready');
                conn.exec(command, (err, stream) =>{
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        var msg = "";
                        stream.on('close', (code, signal) => {
                            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                            if ( code == 0 ) {
                                resolve("")
                            } else {
                                reject(`Sleep status code=[${code}], msg=[${data}]`)
                            }
                            conn.end();
                        }).on('data', (data) => {
                            console.log('STDOUT: ' + data);
                        }).stderr.on('data', (data) => {
                            msg = data;
                            console.log('STDERR: ' + data);
                        });
                    }
                });
            }).on('error', (err)=> {
                console.log(err);
                reject(err);
            }).connect({
                host: machine.destination,
                port: machine.sshPort,
                username: config.userName,
                privateKey: fs.readFileSync(config.sshKeyPath)
            });
        })
    }

}

module.exports = () => {
    return new SSHUtil();
};
