import { Routes } from '@angular/router';
import { ImagemListComponent } from './pages/imagem-list/imagem-list';
import { ImagemFormComponent } from './pages/imagem-form/imagem-form';

export const imagemRoutes: Routes = [
  { path: '', component: ImagemListComponent },
  { path: 'novo', component: ImagemFormComponent },
  { path: 'editar/:id', component: ImagemFormComponent }
];