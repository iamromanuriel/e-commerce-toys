import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarComponentComponent } from './top-bar-component.component';

describe('TopBarComponentComponent', () => {
  let component: TopBarComponentComponent;
  let fixture: ComponentFixture<TopBarComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopBarComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
