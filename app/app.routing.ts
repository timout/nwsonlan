/**
 * Created by timout on 9/21/16.
 */
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from "./main.component";

const appRoutes: Routes = [

    { path: '', component: MainComponent }
];

export const routingComponents: any[] = [
    MainComponent
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
