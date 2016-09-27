import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Machine} from "./machine";

@Component({
    selector: 'edit-machine',
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
               pInputText [(ngModel)]="machine.name" 
               name="name" required #name="ngModel" placeholder="Name"/>
              </td>
           </tr>
           <tr>
             <td><span [style.color]=" (mac.valid) ? 'blue' : 'red'">MAC</span></td>
             <td><input id="mac" pInputText type="text" size="20"  
                        [(ngModel)]="machine.mac" 
                        name="mac" #mac="ngModel" placeholder="MAC Address"
                        required pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"/>
              </td>
           </tr>
           <tr>
             <td><span [style.color]=" (port.valid) ? 'blue' : 'red'">Port</span></td>
             <td>
               <input id="port" type="number"  min="1" max="65535" step="1" size="6" pInputText 
                  [(ngModel)]="machine.port"  name="port" #port="ngModel"
                  required placeholder="Port" pattern="[0-9]+"/>
              </td>            
           </tr> 
           <tr>
             <td><span [style.color]=" (sshPort.valid) ? 'blue' : 'red'">SSH Port</span></td>
             <td>
               <input id="sshPort" type="number" min="1" max="65535" step="1" size="6" pInputText 
                  [(ngModel)]="machine.sshPort" 
                  name="sshPort" #sshPort="ngModel"
                  required placeholder="Port" pattern="[0-9]+"/>
             </td>
           </tr>             
           <tr>
             <td><span [style.color]=" (destination.valid) ? 'blue' : 'red'">Destination</span></td>
             <td>
               <input id="destination" type="text" size="20" pInputText 
                      [(ngModel)]="machine.destination" 
                      name="destination" #destination="ngModel"
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

    constructor() {
    }

    onBeforeShow(){
        console.log(this.editMachine);
        this.machine = this.editMachine.clone();
    }

    onAfterHide(){
        //console.log("hidden");
        this.clean();
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
