import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetLoginComponent } from './reset-login.component';

describe('ResetLoginComponent', () => {
  let component: ResetLoginComponent;
  let fixture: ComponentFixture<ResetLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
