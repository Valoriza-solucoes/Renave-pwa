import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntradasEstoqueZeroKmComponent } from './pages/entradas-estoque-zero-km/entradas-estoque-zero-km.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { SaidasEstoqueVeiculoZeroKmComponent } from './pages/saidas-estoque-veiculo-zero-km/saidas-estoque-veiculo-zero-km.component';

const routes: Routes = [
  // { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: '', component: EstoqueComponent },
  { path: 'entradas-estoque-zero-km', component: EntradasEstoqueZeroKmComponent },
  { path: 'saidas-estoque-veiculo-zero-km', component: SaidasEstoqueVeiculoZeroKmComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
