import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Use the backend URL. For local development, this is typically http://localhost:3000
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  getStatus(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/status`);
  }
}
