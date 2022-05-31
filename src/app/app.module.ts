import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {HttpClientModule } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';

import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { SaidasEstoqueVeiculoZeroKmComponent } from './pages/saidas-estoque-veiculo-zero-km/saidas-estoque-veiculo-zero-km.component';
import { ClienteAutenticadoComponent } from './pages/cliente-autenticado/cliente-autenticado.component';
import { EntradasEstoqueZeroKmComponent } from './pages/entradas-estoque-zero-km/entradas-estoque-zero-km.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { TransferenciaEstoqueZeroKmComponent } from './pages/transferencia-estoque-zero-km/transferencia-estoque-zero-km.component';

registerLocaleData(localePt, 'pt-BR');
@NgModule({
  declarations: [
    AppComponent,
    SaidasEstoqueVeiculoZeroKmComponent,
    ClienteAutenticadoComponent,
    EntradasEstoqueZeroKmComponent,
    EstoqueComponent,
    TransferenciaEstoqueZeroKmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatDialogModule,
    HttpClientModule,
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatBadgeModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [Title, { provide: LOCALE_ID, useValue: 'pt-BR' }, {provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
