import { Routes } from '@angular/router';
import { EntregasComponent } from './entregas/entregas.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeScreenComponent
    },
    {
        path: 'entregas',
        component: EntregasComponent
    }
];
