import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drop2Component } from './drop-2.component';

describe('Drop2Component', () => {
  let component: Drop2Component;
  let fixture: ComponentFixture<Drop2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Drop2Component]
    });
    fixture = TestBed.createComponent(Drop2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
