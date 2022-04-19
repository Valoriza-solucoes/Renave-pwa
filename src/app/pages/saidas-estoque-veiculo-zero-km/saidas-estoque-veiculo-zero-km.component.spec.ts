import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaidasEstoqueVeiculoZeroKmComponent } from './saidas-estoque-veiculo-zero-km.component';

describe('SaidasEstoqueVeiculoZeroKmComponent', () => {
  let component: SaidasEstoqueVeiculoZeroKmComponent;
  let fixture: ComponentFixture<SaidasEstoqueVeiculoZeroKmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaidasEstoqueVeiculoZeroKmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaidasEstoqueVeiculoZeroKmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
