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
    },
    {
        path: 'admin/productos',
        loadComponent: () =>
            import('./admin/products-admin/products-admin.component').then(
                (m) => m.ProductsAdminComponent
            ),
    }
];
