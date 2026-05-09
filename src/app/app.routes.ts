import { Routes } from '@angular/router';
import { Entrega } from './services/firebase.service';
import { EntregasComponent } from './entregas/entregas.component';

export const routes: Routes = [
    {
        path: 'entregas',
        component: EntregasComponent
    }
];
