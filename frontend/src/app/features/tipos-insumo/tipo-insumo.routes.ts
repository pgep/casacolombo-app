import { Routes } from '@angular/router';
import { TipoInsumoListComponent } from './pages/tipo-insumo-list/tipo-insumo-list';
import { TipoInsumoFormComponent } from './pages/tipo-insumo-form/tipo-insumo-form';

export const tipoInsumoRoutes: Routes = [
  { path: '', component: TipoInsumoListComponent },
  { path: 'novo', component: TipoInsumoFormComponent },
  { path: 'editar/:id', component: TipoInsumoFormComponent }
];