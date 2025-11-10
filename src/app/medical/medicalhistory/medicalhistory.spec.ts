import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Medicalhistory } from './medicalhistory';

describe('Medicalhistory', () => {
  let component: Medicalhistory;
  let fixture: ComponentFixture<Medicalhistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Medicalhistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Medicalhistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
