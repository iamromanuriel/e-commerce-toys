import { Routes } from '@angular/router';
import { EntregasComponent } from './entregas/entregas.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { authGuard } from './guards/auth.guard';

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
        canActivate: [authGuard],
        loadComponent: () =>
            import('./admin/products-admin/products-admin.component').then(
                (m) => m.ProductsAdminComponent
            ),
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./auth/login/login.component').then((m) => m.LoginComponent),
    },
];
