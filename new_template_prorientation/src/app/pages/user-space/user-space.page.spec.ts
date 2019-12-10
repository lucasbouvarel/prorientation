import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserSpacePage } from './user-space.page';

describe('UserSpacePage', () => {
  let component: UserSpacePage;
  let fixture: ComponentFixture<UserSpacePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSpacePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSpacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
