import { Component } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-drop-2',
  templateUrl: './drop-2.component.html',
  styleUrls: ['./drop-2.component.css']
})
export class Drop2Component {
  form: FormGroup;
  private idCounter = 1000; // Starting ID counter

  availableElements = [
    { id: this.generateUniqueId('inp'), type: 'text', label: 'Text Input' },
    { id: this.generateUniqueId('inp'), type: 'number', label: 'Number Input' },
    { id: this.generateUniqueId('inp'), type: 'heading', label: 'Heading' },
  ];

  layoutElements = [
    { id: this.generateUniqueId('sec'), type: 'section', label: 'Section', children: [] },
    { id: this.generateUniqueId('el'), type: 'div', label: 'Div', children: [] },
  ];

  formElements: any[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      formElements: new FormArray([]),
    });
  }

  get formArray(): FormArray {
    return this.form.get('formElements') as FormArray;
  }

  generateUniqueId(prefix: string): string {
    return `${prefix}-${this.idCounter++}`;
  }

  drop(event: CdkDragDrop<any[]>, section?: any) {
    if (event.previousContainer === event.container) {
      // Move within the same container (e.g., reordering within a section)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Item moved between containers
      const draggedElement = {
        ...event.previousContainer.data[event.previousIndex],
        id: this.generateUniqueId(event.previousContainer.data[event.previousIndex].type === 'section' ? 'sec' : 'inp'),
        children: [],
      };
  
      if (section && section.type === 'section') {
        // If dragged element is dropped into a section, add it to that section's children
        section.children.push(draggedElement);
      } else {
        // Otherwise, add the element to the form itself
        this.formElements.push(draggedElement);
      }
  
      const control = this.fb.group({
        id: draggedElement.id,
        type: draggedElement.type,
        label: draggedElement.label,
        children: this.fb.array([]),
      });
  
      if (section && section.type === 'section') {
        // Find the form control for the section and add the child to it
        const sectionControl = this.findFormControl(section.id);
        (sectionControl?.get('children') as FormArray).push(control);
      } else {
        this.formArray.push(control);
      }
    }
  }
  

  findFormControl(sectionId: string) {
    return this.formArray.controls.find(
      (control) => control.get('id')?.value === sectionId
    );
  }

  removeElement(index: number, section?: any) {
    if (section) {
      section.children.splice(index, 1);
    } else {
      const removedElement = this.formElements[index];
      this.formElements.splice(index, 1);
      const formArrayIndex = this.formArray.controls.findIndex(
        (control) => control.get('id')?.value === removedElement.id
      );
      this.formArray.removeAt(formArrayIndex);
    }
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  submitForm() {
    console.log('Final Form Data:', this.form.value);
  }
}
