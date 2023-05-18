
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  userid: string;

  constructor(private db: AngularFirestore) {
  this.userid = " ";
 }

addNewUser(name:string, description:string) {
    this.userid = "erESRESGDFdfwedwsefte";
     this.db.collection("PolymerData").doc(this.userid).set({name: name, description: description});
  }
}
