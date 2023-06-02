import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainSearchService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    // Replace with your API endpoint or data source
    return this.http.get<any>('api/data');
  }
}
