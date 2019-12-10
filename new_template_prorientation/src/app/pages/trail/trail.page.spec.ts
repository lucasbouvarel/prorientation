import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrailPage } from './trail.page';

describe('TrailPage', () => {
  let component: TrailPage;
  let fixture: ComponentFixture<TrailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
