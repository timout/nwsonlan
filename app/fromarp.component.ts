import {Component,EventEmitter} from '@angular/core';
import {Dialog, Footer, Button, InputText, DataTable, Column} from 'primeng/primeng';
import {Machine} from "./machine";
import {MachineService} from "./machineservice";
import {ROUTER_DIRECTIVES} from '@angular/router';
@Component({
    selector: 'fromarp',
    directives:[Dialog,Footer,Button,DataTable,Column, ROUTER_DIRECTIVES],
    providers:[MachineService],
    inputs: ['isARPVisible'],
    outputs: ['closeForm'],
    template:`
        <p-dialog id="arptabledialog" header="ARP Cache" [(visible)]="isARPVisible" modal="true" [resizable]="false"
            [closable]="false" (closeOnEscape)="false" (onAfterHide)="onAfterHide()" (onBeforeShow)="onBeforeShow()"            
            width="400"
            >
            <p-dataTable
               [value]="machines" selectionMode="single" [(selection)]="selectedMachine" (onRowDblclick)="onRowDblClick($event)"
              >
                <p-column field="name" header="IP Address"></p-column>
                <p-column field="mac" header="MAC"></p-column>
            </p-dataTable>
          <footer>
            <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
                <button type="button" pButton icon="fa-close" (click)="cancel()" label="Close"></button>
                <button type="button" pButton icon="fa-check" (click)="submit()" label="Create"></button>                
            </div>
        </footer>
        </p-dialog>     
    `
})
export class FromArpComponent {
    private closeForm = new EventEmitter();
    machines:Array<Machine> = [];
    selectedMachine:Machine;

    constructor(private machineService:MachineService) {
    }

    onBeforeShow(){
        this.selectedMachine = null;
        this.machineService.getArpCache().subscribe(arr => {
            this.machines = arr.map( (m) => {
                var machine = new Machine();
                machine.name = m.ip;
                machine.mac = m.mac;
                return machine;
            });
            if ( this.machines.length > 0 ) {
                this.selectedMachine = this.machines[0];
            }
        });
    }
    
    onAfterHide(){
        this.clean();
    }
    

    submit() {
        console.log(this.selectedMachine);
        this.closeForm.emit(this.selectedMachine);
    }

    cancel() {
        this.closeForm.emit({});

    }

    onRowDblClick(machine) {
        this.selectedMachine = machine.data;
        this.submit();
    }

    private clean() {
        this.selectedMachine = null;
    }
}