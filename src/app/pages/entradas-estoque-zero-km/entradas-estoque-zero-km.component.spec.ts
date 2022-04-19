import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradasEstoqueZeroKmComponent } from './entradas-estoque-zero-km.component';

describe('EntradasEstoqueZeroKmComponent', () => {
  let component: EntradasEstoqueZeroKmComponent;
  let fixture: ComponentFixture<EntradasEstoqueZeroKmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntradasEstoqueZeroKmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradasEstoqueZeroKmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
