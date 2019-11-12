import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersoPage } from './perso.page';

describe('PersoPage', () => {
  let component: PersoPage;
  let fixture: ComponentFixture<PersoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
