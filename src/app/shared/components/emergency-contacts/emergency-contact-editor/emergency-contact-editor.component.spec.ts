import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyContactEditorComponent } from './emergency-contact-editor.component';

describe('EmergencyContactEditorComponent', () => {
  let component: EmergencyContactEditorComponent;
  let fixture: ComponentFixture<EmergencyContactEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyContactEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyContactEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
