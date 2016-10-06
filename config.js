const fs = require("fs");
const path = require('path');
const os = require("os");
const util = require("util");
const mkdirp = require('mkdirp');
const logger = require('./log');

class Config {
    constructor(path, cfg) {
        this._path = path;
        this._cfg = cfg;
    }

    get machines() {
        return this._cfg.machines;
    }
    
    get cfg() {
        return {
            userName: this._cfg.userName,
            checkTime: this._cfg.checkTime,
            sshKeyPath: this._cfg.sshKeyPath,
            pocketNum: this._cfg.pocketNum,
            pocketInterval: this._cfg.pocketInterval,
            bindPort: this._cfg.bindPort,
            bindAddress: this._cfg.bindAddress
        }
    }

    get sshKeyPath() {
        return this._cfg.sshKeyPath;
    }

    get userName() {
        return this._cfg.userName
    }

    get checkTimeMs() {  //in millis
        return this._cfg.checkTime * 1000;
    }

    get pocketNum() {
        return this._cfg.pocketNum;
    }

    get pocketInterval() {
        return this._cfg.pocketInterval;
    }

    get bindPort() {
        return this._cfg.bindPort;
    }

    get bindAddress() {
        return this._cfg.bindAddress;
    }

    updateCfg(cfg) {
        this._cfg.userName = cfg.userName;
        this._cfg.checkTime = cfg.checkTime;
        this._cfg.sshKeyPath = cfg.sshKeyPath;
        this._cfg.pocketNum = cfg.pocketNum;
        this._cfg.pocketInterval = cfg.pocketInterval;
        this._cfg.bindPort = cfg.bindPort;
        this._cfg.bindAddress = cfg.bindAddress;
        return this._save();
    }

    add(m) {//TODO: make copy then save in case of err return 500
        this._cfg.machines.push(m);
        return this._save();
    };

    update(name, m) {
        var machines = this._cfg.machines;
        var oldIndex = machines.findIndex( (e,i,a) => { return e.name == name });
        if ( oldIndex == -1 ) return Promise.resolve(false);
        var newIndex = machines.findIndex( (e,i,a) => { return e.name == m.name });
        if (newIndex > -1 && oldIndex != newIndex) return Promise.resolve(false);
        machines.splice(oldIndex,1, m); //remove and insert
        return this._save();
    }

    delete(name) {
        if ( ! name ) return Promise.resolve(false);
        var index = this._cfg.machines.findIndex( (m) => {
            return m.name == name;
        } );
        if ( index > -1 ) {
            this._cfg.machines.splice(index, 1);
            return this._save();
        } else {
            return Promise.resolve(false);
        }
    }

    _save() {
        return isFileExists(this._path)
            .then((res) => {
                if (res) {
                    writeFileSync(this._path, this._cfg);
                    return true;
                } else {
                    logger.error(`${this._path} was deleted!`);
                    return makeDir(this._path).then((res) => {
                        writeFileSync(this._path, this._cfg);
                        return true;
                    });
                }
            });
    }

}

exports.create = (filepath) => {

    return init(filepath).then( (cfg) => {
        return new Config(filepath, cfg);
    });
};


var createDefaultConfig = () => {
    return {
        checkTime: 20,
        userName: "",
        sshKeyPath: "",
        pocketNum: 3,
        pocketInterval: 50,
        bindPort: 18081,
        bindAddress: "0.0.0.0",
        machines: []
    }
};

var init = (filepath) => {
    return isFileExists(filepath)
        .then((res) => {
            if (res) {
                var cfg = readFileSync(filepath);
                return Promise.resolve(cfg);
            } else {
                return createFile(filepath)
            }
        })
        .catch((err) => {
            logger.error(err);
            process.exit(1);
        });
};

var isFileExists = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    resolve(false);
                } else {
                    reject(err);
                }
            }
            resolve(true);
        });
    });
};

var createFile = (filepath) => {
    return makeDir(filepath).then((res) => {
        logger.debug(res);
        var cfg = createDefaultConfig();
        writeFileSync(filepath, cfg);
        return cfg;
    });
};

var makeDir = (filepath) => {
    return new Promise((resolve, reject) => {
        var dir = path.dirname(filepath);
        logger.debug(dir + " was created");
        mkdirp(dir, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        })
    });
};

var readFileSync = (file, options) => {
    var content = fs.readFileSync(file, 'utf8');
    return JSON.parse(content);
};

var writeFileSync = (file, cfg) => {
    var str = JSON.stringify(cfg, null, ' ') + '\n';
    return fs.writeFileSync(file, str, 'utf8')
};

