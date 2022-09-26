import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagenofoundComponent } from './pagenofound.component';

describe('PagenofoundComponent', () => {
  let component: PagenofoundComponent;
  let fixture: ComponentFixture<PagenofoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagenofoundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagenofoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
