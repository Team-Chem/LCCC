import { Component } from '@angular/core';

interface Item {
  name: string;
  age: number;
  address: string;
  phone: string;
  email: string;
  notes: string;
  showDetails: boolean;
}

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.css']
})
export class MainSearchComponent {

  items: Item[] = [
    {
      name: 'John Doe',
      age: 32,
      address: '123 Main St',
      phone: '555-555-5555',
      email: 'john.doe@example.com',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      showDetails: false
    },
    {
      name: 'Jane Smith',
      age: 28,
      address: '456 Elm St',
      phone: '555-555-1234',
      email: 'jane.smith@example.com',
      notes: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      showDetails: false
    }
  ];
  toggleDetails(item: Item) {
    item.showDetails = !item.showDetails;
  }
}
