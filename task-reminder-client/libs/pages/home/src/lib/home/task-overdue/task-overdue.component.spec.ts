import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOverdueComponent } from './task-overdue.component';

describe('TaskOverdueComponent', () => {
  let component: TaskOverdueComponent;
  let fixture: ComponentFixture<TaskOverdueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskOverdueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskOverdueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
