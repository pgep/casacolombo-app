import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  {
    path: 'clientes',
    loadChildren: () => import('./features/clientes/cliente.routes').then((m) => m.clienteRoutes),
  },
  {
    path: 'ferramentas',
    loadChildren: () =>
      import('./features/ferramentas/ferramenta.routes').then((m) => m.ferramentaRoutes),
  },
  {
    path: 'tipos-produto',
    loadChildren: () =>
      import('./features/tipos-produto/tipo-produto.routes').then((m) => m.tipoProdutoRoutes),
  },
  {
    path: 'produtos',
    loadChildren: () => import('./features/produtos/produto.routes').then((m) => m.produtoRoutes),
  },
  {
    path: 'imagens',
    loadChildren: () => import('./features/imagens/imagem.routes').then((m) => m.imagemRoutes),
  },
  {
    path: 'tipos-insumo',
    loadChildren: () =>
      import('./features/tipos-insumo/tipo-insumo.routes').then((m) => m.tipoInsumoRoutes),
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./features/usuarios/usuario.routes').then((m) => m.usuarioRoutes),
  },
  {
    path: 'unidade-medida',
    loadChildren: () =>
      import('./features/unidade-medida/unidade-medida.routes').then((m) => m.unidadeMedidaRoutes),
  },
  {
    path: 'insumos',
    loadChildren: () => import('./features/insumos/insumos.routes').then((m) => m.insumoRoutes),
  },
  {
    path: 'configuracoes',
    loadChildren: () =>
      import('./features/configuracoes/configuracao.routes').then((m) => m.configuracaoRoutes),
  },
  {
    path: 'producao-produtos',
    loadChildren: () =>
      import('./features/producao-produtos/producao.routes').then((m) => m.producaoRoutes),
  },
];
