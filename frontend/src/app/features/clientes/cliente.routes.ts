import { Routes } from '@angular/router';
import { ClienteListComponent } from './pages/cliente-list/cliente-list';
import { ClienteFormComponent } from './pages/cliente-form/cliente-form';

export const clienteRoutes: Routes = [
  { path: '', component: ClienteListComponent },
  { path: 'novo', component: ClienteFormComponent },
  { path: 'editar/:id', component: ClienteFormComponent }
];