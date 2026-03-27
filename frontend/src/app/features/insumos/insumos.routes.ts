import { Routes } from '@angular/router';
import { InsumoListComponent } from './pages/insumos-list/insumos-list';
import { InsumoFormComponent } from './pages/insumos-form/insumos-form';

export const insumoRoutes: Routes = [
  { path: '', component: InsumoListComponent },
  { path: 'novo', component: InsumoFormComponent },
  { path: 'editar/:id', component: InsumoFormComponent },
];
