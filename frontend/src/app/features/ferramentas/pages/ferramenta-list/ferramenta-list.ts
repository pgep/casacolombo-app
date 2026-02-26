import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // ← ADICIONE
import { FerramentaService, Ferramenta } from '../../services/ferramenta';
import { filter } from 'rxjs/operators'; // ← ADICIONE

@Component({
  selector: 'app-ferramenta-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ferramenta-list.html',
  styleUrls: ['./ferramenta-list.css']
})
export class FerramentaListComponent implements OnInit {
  ferramentas: Ferramenta[] = [];

  constructor(
    private ferramentaService: FerramentaService,
    private router: Router  // ← INJETE
  ) {}

  ngOnInit() {
    // 1. Carrega na primeira vez
    this.carregarFerramentas();

    // 2. Recarrega quando VOLTAR para a rota /ferramentas
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd && event.url === '/ferramentas'))
      .subscribe(() => {
        console.log('🔄 Recarregando lista de ferramentas');
        this.carregarFerramentas();
      });
  }

  carregarFerramentas() {
    console.log('🔧 Carregando ferramentas...');
    this.ferramentaService.getFerramentas().subscribe({
      next: (data) => {
        this.ferramentas = data;
        console.log('✅ Ferramentas carregadas:', this.ferramentas.length);
      },
      error: (err) => console.error('❌ Erro:', err)
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza?')) {
      this.ferramentaService.deleteFerramenta(id).subscribe({
        next: () => this.carregarFerramentas(),
        error: (err) => console.error('Erro ao deletar:', err)
      });
    }
  }
}