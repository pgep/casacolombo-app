// frontend/src/app/features/estoque/estoque.routes.ts
import { Routes } from '@angular/router';
import { EstoqueListComponent } from './pages/estoque-list/estoque-list';
import { MovimentacaoListComponent } from './pages/movimentacao-list/movimentacao-list';
import { MovimentacaoFormComponent } from './pages/movimentacao-form/movimentacao-form';

export const estoqueRoutes: Routes = [
  { path: '', component: EstoqueListComponent },
  { path: 'movimentacoes', component: MovimentacaoListComponent },
  { path: 'movimentacoes/novo', component: MovimentacaoFormComponent },
  { path: 'movimentacoes/novo/:insumoId', component: MovimentacaoFormComponent }, // ✅ Rota com parâmetro
  { path: 'movimentacoes/editar/:id', component: MovimentacaoFormComponent },
  { path: 'movimentacoes/:insumoId', component: MovimentacaoListComponent }, // ✅ Rota para histórico por insumo
];
