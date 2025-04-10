import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropFormComponent } from './components/drag-drop-form/drag-drop-form.component';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Drop2Component } from './components/drop-2/drop-2.component';

@NgModule({
  declarations: [
    AppComponent,
    DragDropFormComponent,
    Drop2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
