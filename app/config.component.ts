import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Config} from "./config";
//import * as GU from "./guitil"

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
             <td><span [style.color]="'blue'">SSH Key Path</span></td>
             <td>
               <input id="sshKeyPath" type="text" size="25" pInputText [(ngModel)]="editConfig.sshKeyPath" 
               name="path" placeholder="Path"/>
             </td>
           </tr>
           <tr>
             <td><span [style.color]=" (checkTime.valid) ? 'blue' : 'red'">Check Time(s)</span></td>
             <td>
               <input id="checkTime" type="number" min="1" max="10000" step="1" size="25" pInputText 
                  [(ngModel)]="editConfig.checkTime" 
                  name="checkTime" #checkTime="ngModel"
                  required placeholder="Check Time (s)"/>
             </td>
           </tr>            
           <tr>
             <td><span [style.color]=" (pocketNum.valid) ? 'blue' : 'red'">Number of Pockets</span></td>
             <td>
               <input id="pocketNum" type="number" min="1" max="99" step="1" size="25" pInputText 
                  [(ngModel)]="editConfig.pocketNum"
                  name="pocketNum" #pocketNum="ngModel"
                  required placeholder="Number"/>
             </td>
           </tr>    
           <tr>
             <td><span [style.color]=" (pocketInterval.valid) ? 'blue' : 'red'">Pocket Interval(ms)</span></td>
             <td>
               <input id="pocketInterval" type="number" min="10" max="3000" step="1" size="25" pInputText 
                  [(ngModel)]="editConfig.pocketInterval"
                  name="pocketInterval" #pocketInterval="ngModel"
                  required placeholder="Number"/>
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

    submit() {
        this.closeForm.emit({config: this.editConfig, action: 'update'});
    }

    cancel() {
        this.closeForm.emit({action:'cancel'});
    }

}
