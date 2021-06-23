import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdobriKorisnikeComponent } from './odobri-korisnike.component';

describe('OdobriKorisnikeComponent', () => {
  let component: OdobriKorisnikeComponent;
  let fixture: ComponentFixture<OdobriKorisnikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdobriKorisnikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdobriKorisnikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
