import { Component, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-polymer-entry-form',
  templateUrl: './polymer-entry-form.component.html',
  styleUrls: ['/polymer-entry-form.component.css']
})
export class PolymerEntryFormComponent {
  polymerData = {
    polymerName: '',
    // Your other data properties here...
  };

  constructor(private dialog: MatDialog) { }

  onSubmit() {
    // Do something with the form data here
    console.log(this.polymerData);
  }

  openPreviewModal() {
    this.dialog.open(this.previewModal, {
      data: this.polymerData
    });
  }
}
