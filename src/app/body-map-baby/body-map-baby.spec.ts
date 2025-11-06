import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyMapBaby } from './body-map-baby';

describe('BodyMapBaby', () => {
  let component: BodyMapBaby;
  let fixture: ComponentFixture<BodyMapBaby>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyMapBaby]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyMapBaby);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
