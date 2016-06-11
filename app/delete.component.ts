import {Component,EventEmitter, Input, Output} from '@angular/core';
import {Dialog, Footer, Button, InputText} from 'primeng/primeng';
import {Machine} from "./machine";
import {MachineService} from "./machineservice";
@Component({
    selector: 'delete-machine',
    directives:[Dialog,Footer,Button, InputText],
    providers:[MachineService],
    template:`
        <p-dialog id="deletedialog"
           header='' 
           [(visible)]="isDeleteVisible" modal="true" [resizable]="false"
            [closable]="false" (closeOnEscape)="false" (onAfterHide)="onAfterHide()" (onBeforeShow)="onBeforeShow()">
            <p style="font-size: large; font-weight: bold">Delete "<span style="color: orangered">{{name}}</span>"?</p>
          <footer>
            <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
                <button type="button" pButton icon="fa-close" (click)="cancel()" label="No"></button>
                <button style="color: lightpink" type="button" pButton icon="fa-check" (click)="submit()" label="Yes"></button>                
            </div>
        </footer>
        </p-dialog>     
    `
})
export class DeleteComponent {
    machine:Machine = new Machine();
    name:string = "";
    @Output() closeForm = new EventEmitter();
    @Input() deleteMachine:Machine;
    @Input() isDeleteVisible:boolean;

    constructor() {
    }

    onBeforeShow(){
        this.name = this.deleteMachine.name;
    }

    onAfterHide(){
    }


    submit() {
        this.closeForm.emit(this.deleteMachine);
    }

    cancel() {
        this.closeForm.emit(null);
    }
}
