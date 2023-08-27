import { Component, OnInit} from '@angular/core';
import * as firebase from 'firebase/compat';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  // Each variable used to store results from a collection from firebase
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  accountCreated: firebase.default.firestore.Timestamp | undefined;
  photoURL: string = '';

  ngOnInit(): void {
  }
}
