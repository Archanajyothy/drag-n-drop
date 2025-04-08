import { Component } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-drag-drop-form',
  templateUrl: './drag-drop-form.component.html',
  styleUrls: ['./drag-drop-form.component.css'],
})
export class DragDropFormComponent {
  form: FormGroup;
  private idCounter = 1000; // Starting ID counter

  availableElements = [
    { id: this.generateUniqueId('inp'), type: 'text', label: 'Text Input' },
    { id: this.generateUniqueId('inp'), type: 'number', label: 'Number Input' },
    { id: this.generateUniqueId('inp'), type: 'heading', label: 'Heading' },
  ];

  layoutElements = [
    { id: this.generateUniqueId('sec'), type: 'section', label: 'Section' },
    { id: this.generateUniqueId('el'), type: 'div', label: 'Div' },
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
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const draggedElement = {
        ...event.previousContainer.data[event.previousIndex],
        id: this.generateUniqueId(
          event.previousContainer.data[event.previousIndex].type === 'section'
            ? 'sec'
            : 'inp'
        ),
        children: [],
      };

      if (section && section.type === 'section') {
        section.children.push(draggedElement);
      } else {
        this.formElements.push(draggedElement);
      }

      const control = this.fb.group({
        id: draggedElement.id,
        type: draggedElement.type,
        label: draggedElement.label,
        children: this.fb.array([]),
      });

      if (section && section.type === 'section') {
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

  editHeading(index: number) {
    this.formElements[index].editing = true;
  }

  saveHeading(index: number) {
    this.formElements[index].editing = false;
  }

  submitForm() {
    console.log('Final Form Data:', this.form.value);
  }
}
