import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyMapFemale } from './body-map-female';

describe('BodyMapFemale', () => {
  let component: BodyMapFemale;
  let fixture: ComponentFixture<BodyMapFemale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyMapFemale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyMapFemale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
