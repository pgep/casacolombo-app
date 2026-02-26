import { Routes } from '@angular/router';
import { FerramentaListComponent } from './pages/ferramenta-list/ferramenta-list';
import { FerramentaFormComponent } from './pages/ferramenta-form/ferramenta-form';

export const ferramentaRoutes: Routes = [
  { path: '', component: FerramentaListComponent },
  { path: 'novo', component: FerramentaFormComponent },
  { path: 'editar/:id', component: FerramentaFormComponent }
];