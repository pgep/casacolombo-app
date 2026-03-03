import { Routes } from '@angular/router';
import { ProdutoListComponent } from './pages/produto-list/produto-list';
import { ProdutoFormComponent } from './pages/produto-form/produto-form';

export const produtoRoutes: Routes = [
  { path: '', component: ProdutoListComponent },
  { path: 'novo', component: ProdutoFormComponent },
  { path: 'editar/:id', component: ProdutoFormComponent }
];