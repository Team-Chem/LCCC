import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MainSearchService } from './main-search.service';
import { collection, getDocs } from 'firebase/firestore';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { db, auth } from "../../../environments/firebase";

@Component({
  selector: 'app-data',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.css']
})
export class MainSearchComponent implements OnInit {
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

  pageSize = 10;
  currentPage = 0;
  totalItems!: number;

  constructor(private dataService: MainSearchService) { }

  ngOnInit() {
    this.loadData();
    this.setupSearchControl();
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

}
