import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteAutenticadoComponent } from './cliente-autenticado.component';

describe('ClienteAutenticadoComponent', () => {
  let component: ClienteAutenticadoComponent;
  let fixture: ComponentFixture<ClienteAutenticadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteAutenticadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteAutenticadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
