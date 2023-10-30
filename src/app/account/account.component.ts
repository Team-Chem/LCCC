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

  successMessage?: string;

  // Storing data of user interface
  userInfo?: AngularFirestoreCollection<User>;

  // Each variable used to store results from collection from firebase
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  accountCreated: firebase.default.firestore.Timestamp | undefined;
  photoURL: string = '';

  // List that contains all data from the PolymerData collection that will be used to display on account page

  public dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'Polymer',
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
    'Temperature',
    'Delete'
  ];

  searchControl = new FormControl();

  column: string = "";

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems!: number;


  constructor(public authService: AuthService, private firestore: AngularFirestore, private afAuth: AngularFireAuth, private dataService: MainSearchService) {

    // Pulling data from collection
    this.userInfo = this.firestore.collection<User>('users');
  };

  ngOnInit() {
    // Note -> functions won't be called automatically unless ran from the ngOnInit method
    // this.fetchData();
    this.getCurrentUserUID();
    // this.loadDataForUser('LniKvYXiBuhHp4LZNy6f4z4AFCS2');
    // this.loadData();
    this.setupSearchControl();
    // Displays a success message on account page when user successfully logs in.
    this.authService.successMessage$.subscribe(
      message => {
        this.successMessage = message;
      }
    )
  }


  // Retireve the polymer data from the PolymerData collection
  fetchData() {
    this.firestore.collection('PolymerData').snapshotChanges().subscribe(data => {
      if (this.dataSource) {
        this.dataSource.data = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as any
          };
        });
        // console.log(this.dataSource)
      } else {
        console.error('dataSource is undefined');
      }
    });
  }



  // Whenever a user wants to delete their data, they can delete it and it will be updated back in FireBase
  onDelete(element: any): void {
    // console.log(this.dataSource)
    // console.log('Deleting', element)
    if (element.id) {
      // console.log("Here it is", element.id)
      this.firestore.collection('PolymerData').doc(element.id).delete()
        .then(() => {
          // Successfully deleted the document
          // Now remove the item from the local data source and refresh the table
          const index = this.dataSource.data.indexOf(element);
          if (index > -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription(); // Refresh the table
          }
        })
        .catch(error => {
          console.error("Error deleting document: ", error);
          // Handle the error accordingly
        });
    }
  }

  // Load all data from PolymerData collection from firebase into table
  // async loadData() {
  //   const collectionRef = collection(db, 'PolymerData');
  //   const querySnapshot = await getDocs(collectionRef);

  //   const data = querySnapshot.docs.map(doc => doc.data());
  //   console.log(data); // Log the data to check if it's retrieved correctly

  //   this.dataSource = new MatTableDataSource(data);

  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  //   this.totalItems = data.length;
  // }

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


  convertToCSV(data: any[], excludeFields: string[] = ['uid', 'Composition']): string {
    const csvRows = [];

    // Get the headers and exclude the specified fields
    const headers = Object.keys(data[0]).filter(header => !excludeFields.includes(header));
    csvRows.push(headers.join(','));

    // Loop through the rows and push to csvRows
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }



  downloadCSV(data: any[]) {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.setAttribute('hidden', '');
    anchor.setAttribute('href', url);
    anchor.setAttribute('download', 'data.csv');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }


  // Get the UID of the current user who is signed in
  getCurrentUserUID(): void {
    this.afAuth.user.subscribe(user => {
      if (user) {
        // console.log('Current user UID:', user.uid);
        // Call getUserInfo method to retrieve info about the current user
        this.getUserInfo(user.uid);
        // Call method loadDataForUniqueUser to retrive only the users information from FireBase and display it as a table
        this.loadDataForUniqueUser(user.uid)
      } else {
        // User is not signed in
        // console.log('No user is currently signed in');
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
          // this.accountCreated = user.accountCreated
          this.photoURL = user.photoURL;
          // console.log(user);
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
  loadDataForUniqueUser(uid: string) {
    this.firestore.collection('PolymerData', ref => ref.where('uid', '==', uid))
      .snapshotChanges()
      .subscribe(
        data => {
          const formattedData = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as any
            };
          });
          // console.log('Formatted Data with IDs:', formattedData);
          this.dataSource = new MatTableDataSource(formattedData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalItems = formattedData.length;

          // console.log("Data loaded successfully");
        },
        error => {
          console.error('Error loading data:', error);
        }
      );
  }

}