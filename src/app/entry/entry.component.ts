import { Component, Injectable } from '@angular/core';
import { Entry } from './entry.module';
import { EntryService } from './entry.service';
import { HttpClient } from '@angular/common/http';


@Injectable({providedIn: 'root'})
@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent{
  //creating an empty list for the entries in order to store them in firebase later.
  entries: Entry[] = [];
  name = "";
  description = "";

  constructor(private http: HttpClient){
    this.entries.push(new Entry("TestEntryName", "TestEntryDescription"));
  }

  addNewUser() {
    this.entries.push(new Entry(this.name, this.description))
    return this.http.put("https://lccc-951e9-default-rtdb.firebaseio.com/entries.json", this.entries
    ).subscribe(response => {
      console.log(response);
    });
  }
}
