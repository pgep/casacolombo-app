// frontend/src/app/features/producao-produtos/producao.routes.ts

import { Routes } from '@angular/router';
import { ProducaoListComponent } from './pages/producao-list/producao-list';
import { ProducaoFormComponent } from './pages/producao-form/producao-form';

export const producaoRoutes: Routes = [
  { path: '', component: ProducaoListComponent },
  { path: 'novo', component: ProducaoFormComponent },
  { path: 'editar/:id', component: ProducaoFormComponent },
];
