import { Routes } from '@angular/router';
import { TipoListComponent } from './pages/tipo-list/tipo-list';
import { TipoFormComponent } from './pages/tipo-form/tipo-form';

export const tipoProdutoRoutes: Routes = [
  { path: '', component: TipoListComponent },
  { path: 'novo', component: TipoFormComponent },
  { path: 'editar/:id', component: TipoFormComponent }
];