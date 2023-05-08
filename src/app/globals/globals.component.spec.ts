import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalsComponent } from './globals.component';

describe('GlobalsComponent', () => {
  let component: GlobalsComponent;
  let fixture: ComponentFixture<GlobalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
