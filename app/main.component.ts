import {Component} from '@angular/core';
import {Message, Column} from 'primeng/primeng';
import {Machine} from "./machine";
import {MachineService} from "./machineservice";
import {Config} from "./config";
import {Router} from "@angular/router";
import {MenuItem} from 'primeng/primeng';

@Component({
    templateUrl: 'mainComponent.html'
})
export class MainComponent {
    config:Config;
    isEditVisible: boolean = false;
    isDeleteVisible: boolean = false;
    isConfigVisible: boolean = false;

    isARPVisible: boolean = false;
    
    displayImport: boolean = false;
    machines: Machine[] = [];
    editMachine:Machine;
    private selectedMachines: string[] = [];
    deleteMachine:Machine;
    
    isNew: boolean;

    msgs: Message[] = [];

    timerToken: number;

    menuItems: MenuItem[] = [
        {label: 'Add', icon: 'fa-plus', command: () => { this.clickNew() },
            items: [
                {label: 'New', icon: 'fa-plus', command: () => { this.clickNew() } },
                {label: 'From ARP', icon: 'fa-arrow-right', command: () => { this.clickFromARP() } }
            ]
        },
        {label: 'Start', icon: 'fa-play', command: () => { this.clickStart() } },
        {label: 'Stop', icon: 'fa-pause', command: () => { this.clickSleep() },
            items: [
                {label: 'Sleep', icon: 'fa-pause', command: () => { this.clickSleep() } },
                {label: 'Shutdown', icon: 'fa-power-off', command: () => { this.clickShutdown() } },
                {label: 'Reset', icon: 'fa-refresh', command: () => { this.clickReset() } },
                {label: 'Hibernate', icon: 'fa-minus-circle', command: () => { this.clickHibernate() } }
            ]
        },
        {label: 'Config', icon: 'fa-cog', command: () => { this.clickConfig() } }
    ];

    constructor(private machineService:MachineService, public router: Router) {
    }

    ngOnInit() {
        this.machineService.getMachines().subscribe(ms => {
            this.machines = ms;
        });
        this.machineService.getConfig().subscribe( (cfg) => {
            this.config = cfg;
            this.startStatusCheck();
        });
    }

    clickNew() {
        this.isNew = true;
        this.editMachine = new Machine();
        this.isEditVisible = true;
    }
    
    clickFromARP() {
        this.isARPVisible = true;
    }
    
    clickStart() { this.listOp( (a:Array<string>) => this.machineService.start(a) ); }

    clickSleep() { this.listOp( (a:Array<string>) => this.machineService.sleep(a) ); }

    clickShutdown() { this.listOp( (a:Array<string>) => this.machineService.shutdown(a) ); }

    clickReset() { this.listOp( (a:Array<string>) => this.machineService.reset(a) ); }

    clickHibernate() { this.listOp( (a:Array<string>) => this.machineService.hibernate(a) ); }

    clickDeleteMachine(machine:Machine) {
        if ( ! machine ) return;
        this.deleteMachine = machine;
        this.isDeleteVisible = true;
    }

    clickConfig() {
        this.isConfigVisible = true;
    }

    onCloseEditForm(event){
        this.isEditVisible = false;
        if ( event.action == 'add' ) {
            var m = event.new;
            if ( ! m.name ) {
                this.showError('Empty name');
            } else {
                var i = this.machines.findIndex((element) => { return element.name === m.name });
                if (i == -1) {
                    this.machineService.add(m).subscribe(ms => { this.machines = ms;} );
                } else {
                    this.showError(`${m.name} already exists`);
                }
            }
        } else if (event.action == 'edit' ) {
            var newm: Machine = event.new;
            var oldm: Machine = event.old;
            var oldIndex = this.machines.findIndex( (element) => { return element.name === oldm.name } );
            if ( oldIndex == -1 ) return;
            var newIndex = this.machines.findIndex( (element) => { return element.name === newm.name } );
            if ( newm.name != oldm.name && newIndex > -1 ) {
                this.showError(`${newm.name} already exists`);
            } else {
                this.machineService.update(oldm.name, newm).subscribe(ms => { this.machines = ms;} );
            }
        }
        console.log(event);
    }

    onCloseDeleteForm(machine:Machine){
        this.isDeleteVisible = false;
        //TODO: delete fom server
        if ( ! machine ) return;
        var index = this.machines.indexOf(machine, 0);
        if (index > -1) {
            this.machines.splice(index, 1);
            this.machineService.delete(machine).subscribe(ms => { this.machines = ms;} );
        }
        console.log(event);
    }
    
    onCloseConfigForm(event) {
        this.isConfigVisible = false;
        if ( event.action == 'update' ) {
            this.machineService.updateCfg(event.config).subscribe( (cfg) => { this.config = cfg;} );
        }
    }

    onRowDblClick(event) {
        this.isEditVisible = true;
        this.isNew = false;
        this.editMachine = event.data;
        //console.log(event);
    }

    onCloseFromARPForm(event) {
        this.isARPVisible = false;
        if ( ! event || ! event.name || ! event.mac ) return;
        this.isNew = true;
        this.editMachine = event;
        this.isEditVisible = true;
    }

    showError(msg:string) {
        console.log(`error ${msg}`);
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Error Message', detail:msg});
    }

    private showMessage = (msg) => { if ( msg ) { this.showError(JSON.stringify(msg)); } };

    private listOp( func: (arr:Array<string>) => any){
        if ( this.selectedMachines.length  == 0 ) return;
        var copy = this.selectedMachines.slice();
        this.selectedMachines = [];
        func(copy).subscribe(msg => { this.showMessage(msg); });
    }
    
    //start machines status check
    private startStatusCheck() {
        if ( this.timerToken ) {
            clearTimeout(this.timerToken);
        }
        var checkStatus = () => {
            this.machineService.statusCheck().subscribe( (statuses) => {
                var cp = this.machines.slice();
                statuses.forEach( (s) => {
                    var machine = cp.find( (m) => { return m.name == s.name});
                    if ( machine ) {
                        machine.sshStatus = s.sshStatus;
                        machine.pingStatus = s.pingStatus;
                    }
                });
                this.machines = cp;
                this.timerToken = setTimeout( checkStatus, this.config.checkTimeMs);
            });
        };
        this.timerToken = setTimeout( checkStatus, this.config.checkTimeMs);
    }
}