import { Routes } from '@angular/router';
import { UsuarioList } from './pages/usuario-list/usuario-list';
import { UsuarioForm } from './pages/usuario-form/usuario-form';

export const usuarioRoutes: Routes = [
  { path: '', component: UsuarioList },
  { path: 'novo', component: UsuarioForm },
  { path: 'editar/:id', component: UsuarioForm },
];
