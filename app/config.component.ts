import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Config} from "./config";

@Component({
    selector: 'edit-config',
    template:`
        <p-dialog id="configdialog" 
            [width]="400"
            header="Configuration" 
            [(visible)]="isConfigVisible" modal="true" [resizable]="false"
            [closable]="false" (closeOnEscape)="false" (onAfterHide)="onAfterHide()" (onBeforeShow)="onBeforeShow()">
            <form (ngSubmit)="submit()" #mForm="ngForm">
         <table>
           <tr>
             <td><span [style.color]="'blue'">User Name</span></td>
             <td><input id="name" type="text" size="20" pInputText [(ngModel)]="editConfig.userName" 
             name="userName" placeholder="User Name"/></td>
           </tr>
           <tr>
             <td><span [style.color]=" (checkTime.valid) ? 'blue' : 'red'">Check Time(s)</span></td>
             <td>
               <input id="checkTime" type="text" size="6" pInputText 
                  [(ngModel)]="editConfig.checkTime" 
                  name="checkTime" #checkTime="ngModel"
                  required placeholder="Check Time (s)" pattern="[0-9]+"/>
                  <i class="fa fa-minus-square-o" (click)="checkTimeMinus()" style="cursor:pointer"></i>
                  <i class="fa fa-plus-square-o" (click)="checkTimePlus()" style="cursor:pointer"></i>
             </td>
           </tr>            
           <tr>
             <td><span [style.color]="'blue'">SSH Key Path</span></td>
             <td>
               <input id="sshKeyPath" type="text" size="25" pInputText [(ngModel)]="editConfig.sshKeyPath" 
               name="path" placeholder="Path"/>
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
export class ConfigComponent {
    @Output() closeForm = new EventEmitter();
    @Input() config:Config;
    @Input() isConfigVisible:boolean;
    editConfig:Config = new Config();

    constructor() {
    }

    onBeforeShow(){
        this.editConfig = this.config.clone();
    }

    onAfterHide(){
    }

    checkTimeMinus() {
        if ( ! this.editConfig.checkTime ) this.editConfig.checkTime = 0;
        if ( this.editConfig.checkTime > 1 ) {
            this.editConfig.checkTime -= 1;
        }
    }

    checkTimePlus() {
        if ( ! this.editConfig.checkTime ) this.editConfig.checkTime = 0;
        if ( this.editConfig.checkTime < 10000  ) {
            this.editConfig.checkTime += 1;
        }
    }

    submit() {
        this.closeForm.emit({config: this.editConfig, action: 'update'});
    }

    cancel() {
        this.closeForm.emit({action:'cancel'});
    }
}
