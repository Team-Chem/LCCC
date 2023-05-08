import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSearchComponent } from './sub-search.component';

describe('SubSearchComponent', () => {
  let component: SubSearchComponent;
  let fixture: ComponentFixture<SubSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
