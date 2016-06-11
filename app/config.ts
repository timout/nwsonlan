/**
 * Created by timout on 5/20/16.
 */

export class Config {
    private _userName: string;
    private _checkTime: number;
    private _sshKeyPath: string;

    constructor(){
        this._userName = "";
        this._sshKeyPath= "";
        this._checkTime = 20;
    }

    clone() : Config {
        var c = new Config();
        c.userName = this.userName;
        c.sshKeyPath = this.sshKeyPath;
        c.checkTime = this.checkTime;
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

    static create(c:any) : Config {
        var cfg:Config = new Config();
        if ( c ) {
            if ( c.userName ) cfg.userName = c.userName;
            if ( c.sshKeyPath ) cfg.sshKeyPath = c.sshKeyPath;
            if ( c.checkTime ) cfg.checkTime = c.checkTime;
        }
        return cfg;
    }
}