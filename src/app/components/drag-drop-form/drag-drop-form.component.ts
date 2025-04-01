import { Component } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-drag-drop-form',
  templateUrl: './drag-drop-form.component.html',
  styleUrls: ['./drag-drop-form.component.css']
})
export class DragDropFormComponent {

  form: FormGroup;
  
  availableElements = [
    { id: 'textInput', type: 'text', label: 'Text Input' },
    { id: 'numberInput', type: 'number', label: 'Number Input' },
    { id: 'heading', type: 'heading', label: 'Heading' }
  ];
  layoutElements = [
    {id: 'section', type: 'section', label: 'Section'},
    {id: 'div', type: 'div', label: 'div'}
  ];

  formElements: any[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      formElements: new FormArray([])
    });
  }

  get formArray(): FormArray {
    return this.form.get('formElements') as FormArray;
  }

  drop(event: CdkDragDrop<any[]>, section?: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const draggedElement = { ...event.previousContainer.data[event.previousIndex], children: [] };
  
      if (section && section.type === 'section') {
        // If dropping inside a section, push to its children
        section.children.push(draggedElement);
      } else {
        // Otherwise, push to main formElements array
        this.formElements.push(draggedElement);
      }
    
      const control = this.fb.group({
        id: draggedElement.id,
        type: draggedElement.type,
        label: draggedElement.label,
        children: this.fb.array([]),
      });
  
      if (section && section.type === 'section') {
        // Push control to section's FormArray (for nested elements)
        const sectionControl = this.findFormControl(section.id);
        (sectionControl?.get('children') as FormArray).push(control);
      } else {
        // Push to main formArray
        this.formArray.push(control);
      }
    }
  }
  
  
  findFormControl(sectionId: string) {
    return this.formArray.controls.find(control => control.get('id')?.value === sectionId);
  }

  removeElement(index: number, section?: any) {
    if (section) {
      section.children.splice(index, 1);
    } else {
      const removedElement = this.formElements[index];
      this.formElements.splice(index, 1);
      const formArrayIndex = this.formArray.controls.findIndex(control => control.get('id')?.value === removedElement.id);
      this.formArray.removeAt(formArrayIndex);
    }
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }
  
  editHeading(index: number) {
    this.formElements[index].editing = true;
  }
  
  saveHeading(index: number) {
    this.formElements[index].editing = false;
  }

  submitForm() {
    console.log("Final Form Data:", this.form.value);
  }
}
