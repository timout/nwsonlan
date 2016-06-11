import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FORM_DIRECTIVES } from '@angular/common';
import {Dialog, Footer, Button, InputText} from 'primeng/primeng';
import {Machine} from "./machine";
import {MachineService} from "./machineservice";
import {ROUTER_DIRECTIVES} from '@angular/router';
@Component({
    selector: 'edit-machine',
    directives:[Dialog,Footer,Button, InputText, ROUTER_DIRECTIVES,FORM_DIRECTIVES],
    providers:[MachineService],
    template:`
        <p-dialog id="editdialog" 
            [header]=" (isNew) ? 'New Machine' : 'Edit Machine'" 
            [(visible)]="isEditVisible" modal="true" [resizable]="false"
            [closable]="false" (closeOnEscape)="false" (onAfterHide)="onAfterHide()" (onBeforeShow)="onBeforeShow()">
            <form (ngSubmit)="submit()" #mForm="ngForm">
         <table>
           <tr>
             <td><span [style.color]=" (name.valid) ? 'blue' : 'red'">Name</span></td>
             <td>
               <input id="name" type="text" size="20" 
               pInputText [(ngModel)]="machine.name" ngControl="name" required #name="ngForm" placeholder="Name"/>
              </td>
           </tr>
           <tr>
             <td><span [style.color]=" (mac.valid) ? 'blue' : 'red'">MAC</span></td>
             <td><input id="mac" pInputText type="text" size="20"  
                        [(ngModel)]="machine.mac" ngControl="mac" #mac="ngForm" placeholder="MAC Address"
                        required pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"/>
              </td>
           </tr>
           <tr>
             <td><span [style.color]=" (port.valid) ? 'blue' : 'red'">Port</span></td>
             <td>
               <input id="port" type="text" size="6" pInputText 
                  [(ngModel)]="machine.port" ngControl="port" #port="ngForm"
                  required placeholder="Port" pattern="[0-9]+"/>
                  <i class="fa fa-minus-square-o" (click)="portMinus()" style="cursor:pointer"></i>
                  <i class="fa fa-plus-square-o" (click)="portPlus()" style="cursor:pointer"></i>
               <!--<button pButton type="button" (click)="portMinus()" icon="fa-minus" iconPos="left"></button>-->
               <!--<button pButton type="button" (click)="portPlus()" icon="fa-plus" iconPos="right"></button>-->
             </td>
           </tr> 
           <tr>
             <td><span [style.color]=" (sshPort.valid) ? 'blue' : 'red'">SSH Port</span></td>
             <td>
               <input id="sshPort" type="text" size="6" pInputText 
                  [(ngModel)]="machine.sshPort" ngControl="sshPort" #sshPort="ngForm"
                  required placeholder="Port" pattern="[0-9]+"/>
                  <i class="fa fa-minus-square-o" (click)="sshPortMinus()" style="cursor:pointer"></i>
                  <i class="fa fa-plus-square-o" (click)="sshPortPlus()" style="cursor:pointer"></i>
             </td>
           </tr>             
           <tr>
             <td><span [style.color]=" (destination.valid) ? 'blue' : 'red'">Destination</span></td>
             <td>
               <input id="destination" type="text" size="20" pInputText 
                      [(ngModel)]="machine.destination" ngControl="destination" #destination="ngForm"
                      required placeholder="Destination" 
                      pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"/>
             </td>
           </tr>
         </table>         
          <footer>
            <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
                <button type="button" pButton icon="fa-close" (click)="cancel()" label="Close"></button>
                <button type="submit" pButton icon="fa-check"  [label]=" (isNew)? 'Create' : 'Save'"></button>                
            </div>            
        </footer>
        </form>
        </p-dialog>     
    `
})
export class EditComponent {
    @Output() closeForm = new EventEmitter();
    @Input() editMachine:Machine;
    @Input() isNew:boolean;
    @Input() isEditVisible:boolean;
    machine:Machine = new Machine();

    constructor(private machineService:MachineService) {
    }

    onBeforeShow(){
        console.log(this.editMachine);
        this.machine = this.editMachine.clone();
    }

    onAfterHide(){
        //console.log("hidden");
        this.clean();
    }

    sshPortMinus() {
        if ( ! this.machine.sshPort ) this.machine.sshPort = 0;
        if ( this.machine.sshPort > 0 ) {
            this.machine.sshPort -= 1;
        }
    }

    sshPortPlus() {
        if ( ! this.machine.sshPort ) this.machine.sshPort = 0;
        if ( this.machine.sshPort < 65535  ) {
            this.machine.sshPort += 1;
        }
    }

    portMinus() {
        if ( ! this.machine.port ) this.machine.port = 0;
        if ( this.machine.port > 0 ) {
            this.machine.port -= 1;
        }
    }

    portPlus() {
        if ( ! this.machine.port ) this.machine.port = 0;
        if ( this.machine.port < 65535  ) {
            this.machine.port += 1;
        }
    }

    submit() {
        console.log('submit');
        this.closeForm.emit({old: this.editMachine, new: this.machine, action: (this.isNew)?'add':'edit'});
    }

    cancel() {
        console.log('cancel');
        this.closeForm.emit({action:'cancel'});
    }

    private clean() {
        this.machine = new Machine();
    }
}
