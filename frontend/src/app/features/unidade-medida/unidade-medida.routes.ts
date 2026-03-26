import { Routes } from '@angular/router';
import { UnidadeMedidaListComponent } from './pages/unidade-medida-list/unidade-medida-list';
import { UnidadeMedidaFormComponent } from './pages/unidade-medida-form/unidade-medida-form';

export const unidadeMedidaRoutes: Routes = [
  { path: '', component: UnidadeMedidaListComponent },
  { path: 'novo', component: UnidadeMedidaFormComponent },
  { path: 'editar/:id', component: UnidadeMedidaFormComponent },
];
