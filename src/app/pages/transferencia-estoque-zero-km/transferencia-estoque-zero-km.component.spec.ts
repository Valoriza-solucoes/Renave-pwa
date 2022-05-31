import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaEstoqueZeroKmComponent } from './transferencia-estoque-zero-km.component';

describe('TransferenciaEstoqueZeroKmComponent', () => {
  let component: TransferenciaEstoqueZeroKmComponent;
  let fixture: ComponentFixture<TransferenciaEstoqueZeroKmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferenciaEstoqueZeroKmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferenciaEstoqueZeroKmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
