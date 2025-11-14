import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface Contact {
  id?: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  cell?: string;
  registered: Date | string;
  age: number;
  picture: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/api/contacts'; // your backend

  constructor(private http: HttpClient) {}

  create(contact: Contact): Observable<Contact> {
    const payload = { ...contact, id: contact.id || uuidv4() };
    return this.http.post<Contact>(this.apiUrl, payload);
  }

  update(id: string, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }


  // add delete

  // get one 
  getById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }
}