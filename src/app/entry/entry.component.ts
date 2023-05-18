import { Component } from '@angular/core';
import { Entry } from './entry.module';
import { EntryService } from 'src/app/services/entry.servcie';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent{
  //creating an empty list for the entries in order to store them in firebase later.
  entries: Entry[] = [];

  constructor(public entryService: EntryService){
    this.entries.push(new Entry("TestEntryName", "TestEntryDescription"));
  }
}
