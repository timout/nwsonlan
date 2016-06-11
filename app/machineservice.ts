import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Machine} from './machine';
import 'rxjs/add/operator/map'
import {Config} from "./config";

@Injectable()
export class MachineService {

    constructor(private http: Http) { }

    getConfig() {
        return this.http.get('/api/config').map(res => res.json()).map((cfg) => { return Config.create(cfg); } );
    }

    getMachines() {
        return this.http.get('/api/machines').map(res => res.json()).map((ms) => this.transformMachines(ms));
    }

    getArpCache() {
        return this.http.get('/api/arp').map(res => res.json());
    }

    updateCfg(config:Config) {
        var b = JSON.stringify(config);
        var headers = this.headers();
        return this.http.put('/api/config', b, {headers: headers})
            .map(res => res.json())
            .map((cfg) => { return Config.create(cfg); } );
    }

    add(machine:Machine) {
        var b = JSON.stringify(machine);
        var headers = this.headers();
        return this.http.post(`/api/machines/${machine.name}`, b, {headers: headers})
            .map(res => res.json())
            .map((ms) => this.transformMachines(ms));
    }

    update(oldName:string, updated:Machine) {
        var b = JSON.stringify(updated);
        var headers = this.headers();
        return this.http.put(`/api/machines/${oldName}`, b, {headers: headers})
            .map(res => res.json())
            .map((ms) => this.transformMachines(ms));
    }    

    delete(machine:Machine) {
        return this.http.delete(`/api/machines/${machine.name}`)
            .map(res => res.json())
            .map((ms) => this.transformMachines(ms));
    }
    
    start( machines : string []) {
        return this.listOp('start', machines);
    }

    sleep( machines : string []) {
        return this.listOp('sleep', machines);
    }

    shutdown( machines : string []) {
        return this.listOp('shutdown', machines);
    }

    hibernate( machines : string []) {
        return this.listOp('hibernate', machines);
    }

    reset( machines : string []) {
        return this.listOp('reset', machines);
    }

    statusCheck() {
        return this.http.get('/api/status').map(res => res.json());
    }

    private listOp(op: string, machines : string []) {
        var msg = {machines: machines};
        var b = JSON.stringify(msg);
        var headers = this.headers();
        return this.http.post(`/api/${op}`, b, {headers: headers}).map(res => res.json());
    }

    private headers() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return headers;
    }

    private transformMachines(ms) {
        return ms.map( (m) => {return Machine.create(m);} );
    }

}