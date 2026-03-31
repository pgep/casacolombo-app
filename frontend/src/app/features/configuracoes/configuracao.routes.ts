import { Routes } from '@angular/router';
import { ConfiguracaoListComponent } from './pages/configuracao-list/configuracao-list';
import { ConfiguracaoFormComponent } from './pages/configuracao-form/configuracao-form';

export const configuracaoRoutes: Routes = [
  { path: '', component: ConfiguracaoListComponent },
  { path: 'novo', component: ConfiguracaoFormComponent },
  { path: 'editar/:id', component: ConfiguracaoFormComponent },
];
