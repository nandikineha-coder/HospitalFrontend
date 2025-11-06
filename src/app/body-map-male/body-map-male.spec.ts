import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyMapMale } from './body-map-male';

describe('BodyMapMale', () => {
  let component: BodyMapMale;
  let fixture: ComponentFixture<BodyMapMale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyMapMale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyMapMale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
