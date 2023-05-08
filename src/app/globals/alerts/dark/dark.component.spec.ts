import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkComponent } from './dark.component';

describe('DarkComponent', () => {
  let component: DarkComponent;
  let fixture: ComponentFixture<DarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
