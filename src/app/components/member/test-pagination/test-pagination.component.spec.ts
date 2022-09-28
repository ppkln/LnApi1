import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPaginationComponent } from './test-pagination.component';

describe('TestPaginationComponent', () => {
  let component: TestPaginationComponent;
  let fixture: ComponentFixture<TestPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPaginationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
