/**
 * Created by timout on 3/21/16.
 */
export class Machine {
    private _name: string;
    private _mac: string;
    private _port: number;
    private _destination: string;
    private _sshPort;
    private _sshStatus: boolean;
    private _pingStatus: boolean;

    constructor(){
        this._name = "";
        this._mac = "";
        this._port = 9;
        this._sshPort = 22;
        this._destination = "255.255.255.0";
        this._sshStatus = false;
        this._pingStatus = false;
    }

    clone() : Machine {
        var m = new Machine();
        m.port = this.port;
        m.sshPort = this.sshPort;
        m.name = this.name;
        m.mac = this.mac;
        m.destination = this.destination;
        return m;
    }


    get name():string {
        return this._name;
    }

    set name(value:string) {
        this._name = value;
    }

    get mac():string {
        return this._mac;
    }

    set mac(value:string) {
        this._mac = value;
    }

    get port():number {
        return this._port;
    }

    set port(value:number) {
        this._port = value;
    }

    get sshPort() {
        return this._sshPort;
    }

    set sshPort(value) {
        this._sshPort = value;
    }

    get destination():string {
        return this._destination;
    }

    set destination(value:string) {
        this._destination = value;
    }
    
    get sshStatus():boolean {
        return this._sshStatus;
    }

    set sshStatus(value:boolean) {
        this._sshStatus = value;
    }

    get pingStatus():boolean {
        return this._pingStatus;
    }

    set pingStatus(value:boolean) {
        this._pingStatus = value;
    }

    static create(m:any) : Machine {
        var machine:Machine = new Machine();
        if ( m ) {
            if ( m.name ) machine.name = m.name;
            if ( m.mac ) machine.mac = m.mac;
            if ( m.port ) machine.port = m.port;
            if ( m.destination ) machine.destination = m.destination;
            if ( m.sshPort ) machine.sshPort = m.sshPort;
        }
        return machine;
    }
}