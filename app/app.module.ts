/**
 * Created by timout on 9/18/16.
 */

import {NgModule}      from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule}    from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent}  from './app.component';
import {MachineService} from "./machineservice";

import {EditComponent} from "./edit.component";
import {ConfigComponent} from "./config.component";
import {DeleteComponent} from "./delete.component";
import {FromArpComponent} from "./fromarp.component";

import {MenubarModule} from 'primeng/primeng';

import {InputTextModule,DialogModule} from 'primeng/primeng';
import {CheckboxModule} from 'primeng/primeng';
import {DataTableModule,SharedModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';

import { routing, appRoutingProviders, routingComponents }  from './app.routing';


@NgModule({
    imports:      [
        MenubarModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        InputTextModule,
        DataTableModule,
        SharedModule,
        ButtonModule,
        DialogModule,
        CheckboxModule,
        GrowlModule,
        routing
    ],
    declarations: [
        AppComponent,
        ConfigComponent,
        EditComponent,
        DeleteComponent,
        FromArpComponent,
        routingComponents
    ],
    bootstrap:    [
        AppComponent
    ],
    providers:    [
        MachineService, appRoutingProviders
    ]
})
export class AppModule { }

