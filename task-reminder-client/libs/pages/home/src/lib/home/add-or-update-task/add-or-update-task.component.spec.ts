import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdateTaskComponent } from './add-or-update-task.component';

describe('AddOrUpdateTaskComponent', () => {
  let component: AddOrUpdateTaskComponent;
  let fixture: ComponentFixture<AddOrUpdateTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddOrUpdateTaskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddOrUpdateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
