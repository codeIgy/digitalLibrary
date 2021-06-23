import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookreguserComponent } from './bookreguser.component';

describe('BookreguserComponent', () => {
  let component: BookreguserComponent;
  let fixture: ComponentFixture<BookreguserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookreguserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookreguserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
