"use strict";

const debug = require('debug')('server');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const util = require('util');
const netutil = require('./netutil')();

const sshUtil = require('./sshutil')();

var cla = require('command-line-args');

const path = require('path');
const defaultConfigPath = path.join(__dirname, 'config', 'machines.json');

var cli = cla([
    {
        name: 'property',
        type: String,
        alias: 'p',
        defaultValue: defaultConfigPath
    },
    {name: 'port', type: Number, defaultValue: 18080}
]);

const options = cli.parse();
const fullPath = options.property;
const port = options.port;

var config;
const configFactory = require('./config').create(fullPath);
var machineStatus = [];
var statusInterval;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static('public'));
// app.use('/libs', express.static('node_modules/bootstrap/dist'));
app.use('/libs', express.static('node_modules/systemjs/dist'));
app.use('/libs', express.static('node_modules/zone.js/dist'));
app.use('/libs', express.static('node_modules/reflect-metadata'));
app.use('/libs/rxjs', express.static('node_modules/rxjs'));
app.use('/libs', express.static('node_modules/es6-shim'));
app.use('/libs', express.static('node_modules/font-awesome'));

app.use('/libs/@angular', express.static('node_modules/@angular'));
app.use('/libs/angular2-in-memory-web-api', express.static('node_modules/angular2-in-memory-web-api'));
app.use('/libs/primeui', express.static('node_modules/primeui'));
app.use('/libs/primeng', express.static('node_modules/primeng'));


router.use((req, res, next) => {
    console.warn(req.method + "	" + req.url + "	with	" + JSON.stringify(req.body));
    next();
});

router.get('/', (req, res) => {
    res.json({message: 'hello	world!'});
});

router.get('/machines', (req, res) => {
    res.json(config.machines);
});

router.get('/status', (req, res) => {
    res.json(machineStatus);
});

router.get('/arp', (req, res) => {
    res.json(netutil.readARP());
});

router.get('/config', (req, res) => {
    res.json(config.cfg);
});

router.put('/config', (req, res) => {
    console.log("update config");
    console.log(util.inspect(req.body));
    var cfg = configFromBody(req);
    config.updateCfg(cfg).then(() => {
        console.log("ok");
        res.json(config.cfg);
    }).catch((err) => {
        console.log(util.inspect(err));
        res.json(config.cfg);
        //res.json() TODO: send error
    });

    res.json(config.cfg);
});

router.post('/machines/:name?', (req, res) => {
    console.log("add");
    console.log(util.inspect(req.body));
    var name = req.params.name;
    console.log(name);
    if (!name) res.json(config.machines);    
    var m = machineFromBody(req);
    config.add(m).then(() => {
        console.log("ok");
        res.json(config.machines);
    }).catch((err) => {
        console.log(util.inspect(err));
        res.json(config.machines);
        //res.json() TODO: send error
    });
});

router.put('/machines/:name?', (req, res) => {
    console.log("update");
    console.log(util.inspect(req.body));
    var name = req.params.name;
    console.log(name);
    if (!name) res.json(config.machines);
    var m = machineFromBody(req);
    config.update(name, m).then(() => {
        console.log("ok");
        res.json(config.machines);
    }).catch((err) => {
        console.log(util.inspect(err));
        res.json(config.machines);
        //res.json() TODO: send error
    });
});

router.delete('/machines/:name?', (req, res) => {
    var name = req.params.name;
    debug(`deleting ${name}`);
    config.delete(name).then(() => { res.json(config.machines); });
});

router.post('/start', (req, res) => {
    console.log("start");
    console.log(util.inspect(req.body));
    const machines = findFromRequest(req);
    if (machines.length == 0) {
        res.json("");
    } else {
        var p = machines.map((m) => {
            return netutil.wake(m);
        });
        Promise.all(p)
            .then((err) => {
                if (err) console.log(err);
                console.log("done");
                res.json("");
            })
            .catch((err) => {
                console.log(err);
                res.json("");
            });
    }
    //TODO: errors
});

router.post('/sleep', (req, res) => { sshOp(sshUtil.SLEEP, req, res); });
router.post('/shutdown', (req, res) => { sshOp(sshUtil.SHUTDOWN, req, res); });
router.post('/hibernate', (req, res) => { sshOp(sshUtil.HIBERNATE, req, res); });
router.post('/reset', (req, res) => { sshOp(sshUtil.RESET, req, res); });


app.use('/api', router);

configFactory.then((cfg) => { //As soon as
    config = cfg;
    app.listen(port);
    console.log('Listen:	' + port);
    setStatusCheck();
});

function machineFromBody(req) {
    return {
        name: req.body._name,
        mac: req.body._mac,
        port: req.body._port,
        sshPort: req.body._sshPort,
        destination: req.body._destination
    }
}

function configFromBody(req) {
    return {
        userName: req.body._userName,
        checkTime: req.body._checkTime,
        sshKeyPath: req.body._sshKeyPath
    }
}

var findFromRequest = (req) => {
    return req.body.machines
        .map((name) => { return config.machines.find((m) => { return m.name === name }) }).filter((m) => { return m; });
};

var sshOp = (op, req, res) => {
    console.log(op);
    console.log("kk");
    console.log(util.inspect(req.body));
    const machines = findFromRequest(req);
    var p = sshUtil.op(op, machines, config);
    Promise.all(p).then(() => { res.json(""); }).catch((err) => { console.log(err); res.json(err); });
};

var setStatusCheck = () => {
    if ( statusInterval ) {
        clearInterval(statusInterval);
    }
    statusInterval = setInterval( () => {
        console.log("check machines status");
        netutil.pingAll(config.machines).then( (status) => { machineStatus = status; console.log(machineStatus); });
    },config.checkTimeMs);
};