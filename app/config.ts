/**
 * Created by timout on 5/20/16.
 */

export class Config {
    private _userName: string;
    private _checkTime: number;
    private _sshKeyPath: string;
    private _pocketNum: number;
    private _pocketInterval: number;
    private _bindPort: number;
    private _bindAddress: string;

    constructor(){
        this._userName = "";
        this._sshKeyPath= "";
        this._checkTime = 20;
        this._pocketNum = 3;
        this._pocketInterval = 50;
        this._bindPort = 18081;
        this._bindAddress="0.0.0.0";
    }

    clone() : Config {
        var c = new Config();
        c.userName = this.userName;
        c.sshKeyPath = this.sshKeyPath;
        c.checkTime = this.checkTime;
        c.pocketNum = this.pocketNum;
        c.pocketInterval = this.pocketInterval;
        c.bindPort = this.bindPort;
        c.bindAddress = this.bindAddress;
        return c;
    }

    get userName():string {
        return this._userName;
    }

    set userName(value:string) {
        this._userName = value;
    }

    get checkTime():number {
        return this._checkTime;
    }

    get checkTimeMs():number {
        return this._checkTime * 1000;
    }

    set checkTime(value:number) {
        this._checkTime = value;
    }

    get sshKeyPath():string {
        return this._sshKeyPath;
    }

    set sshKeyPath(value:string) {
        this._sshKeyPath = value;
    }

    get pocketNum(): number {
        return this._pocketNum;
    }

    set pocketNum(value: number) {
        this._pocketNum = value;
    }

    get pocketInterval(): number {
        return this._pocketInterval;
    }

    set pocketInterval(value: number) {
        this._pocketInterval = value;
    }

    get bindPort(): number {
        return this._bindPort;
    }

    set bindPort(value: number) {
        this._bindPort = value;
    }

    get bindAddress(): string {
        return this._bindAddress;
    }

    set bindAddress(value: string) {
        this._bindAddress = value;
    }

    static create(c:any) : Config {
        var cfg:Config = new Config();
        if ( c ) {
            if (c.userName) cfg.userName = c.userName;
            if (c.sshKeyPath) cfg.sshKeyPath = c.sshKeyPath;
            if (c.checkTime) cfg.checkTime = c.checkTime;
            if (c.pocketNum) cfg.pocketNum = c.pocketNum;
            if (c.pocketInterval) cfg.pocketInterval = c.pocketInterval;
            if (c.bindPort) cfg.bindPort = c.bindPort;
            if (c.bindAddress) cfg.bindAddress = c.bindAddress;
        }
        return cfg;
    }
}