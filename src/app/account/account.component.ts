import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../services/auth.service';
import { db } from 'src/environments/firebase';
import { MainSearchService } from '../search/main-search/main-search.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { user } from '@angular/fire/auth';
import * as firebase from 'firebase/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../services/user.model';
import { collection, getDocs } from 'firebase/firestore';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';



@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {

  // Storing data of user interface
  userInfo?: AngularFirestoreCollection<User>;

  // Each variable used to store results from collection from firebase
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  accountCreated: firebase.default.firestore.Timestamp | undefined;
  photoURL: string = '';

  // List that contains all data from the PolymerData collection that will be used to display on account page

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'PolymerName',
    'FlowRate',
    'MolarMassRange',
    'ColumnName',
    'DOI',
    'Detectors',
    'Diameter',
    'ColumnLength',
    'InjectionVolume',
    'PoreSize',
    'Pressure',
    'Solvent',
    'Temperature'
  ];

  searchControl = new FormControl();

  column: string = "";

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 5;
  currentPage = 0;
  totalItems!: number;


  constructor(public authService: AuthService, private firestore: AngularFirestore, private afAuth: AngularFireAuth, private dataService: MainSearchService) {

    // Pulling data from collection
    this.userInfo = this.firestore.collection<User>('users');
  };

  ngOnInit(): void {
    // Note -> functions won't be called automatically unless ran from the ngOnInit method
    this.getCurrentUserUID();
    const userUID = "ynbrWdF2IFbbIMU7e05iMT9pm8f2";
    this.getUserResults(userUID);
    this.loadData();
    this.setupSearchControl();
  }

  // Get the UID of the current user who is signed in
  userId: string = '';
  getCurrentUserUID(): void {
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        console.log('Current user UID:', this.userId);
        this.getUserInfo(this.userId); // Call getUserInfo with the userId
      } else {
        // User is not signed in
        console.log('No user is currently signed in');
      }
    });
  }

  // Use the UID of the currently logged in user and retreive the information about that user from the users collection in Firebase
  getUserInfo(uid: string): void {
    if (uid) {
      this.userInfo?.doc(uid).get().subscribe(doc => {
        if (doc.exists) {
          const user = doc.data() as User;
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.email = user.email;
          this.accountCreated = user.accountCreated
          this.photoURL = user.photoURL;
          console.log(user);
          // Display or process the retrieved user information
        } else {
          console.log('User not found');
        }
      });
    } else {
      console.log('Invalid UID');
    }
  }

  // Get results form PolymerData collection for unique user
  getUserResults(userUID: string) {
    this.firestore
      .collection('PolymerData', (ref) => ref.where('uid', '==', userUID))
      .valueChanges()
      .subscribe((results: any[]) => {
        this.displayedColumns = results.map(result => result.columnName); // Extract column names
        this.dataSource = new MatTableDataSource(results);

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalItems = results.length;
      });
  }

  async loadData() {
    const collectionRef = collection(db, 'PolymerData');
    const querySnapshot = await getDocs(collectionRef);

    const data = querySnapshot.docs.map(doc => doc.data());
    console.log(data); // Log the data to check if it's retrieved correctly

    this.dataSource = new MatTableDataSource(data);

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.totalItems = data.length;
  }


  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
  }

  setupSearchControl() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Add a debounce time to wait for user input
        distinctUntilChanged() // Only emit distinct values
      )
      .subscribe(searchTerm => {
        this.applyFilter(searchTerm);
      });
  }

  applyFilter(searchTerm: string) {
    const filterValue = searchTerm.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }


}


