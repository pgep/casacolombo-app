import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { 
    path: 'clientes', 
    loadChildren: () => import('./features/clientes/cliente.routes').then(m => m.clienteRoutes)
  },
  { 
    path: 'ferramentas', 
    loadChildren: () => import('./features/ferramentas/ferramenta.routes').then(m => m.ferramentaRoutes)
  }
];