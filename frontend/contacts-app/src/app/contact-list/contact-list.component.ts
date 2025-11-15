// src/app/contact-list/contact-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactService, Contact } from '../contact.service';
import { HttpClient } from '@angular/common/http';

interface RandomUser {
  name: { first: string; last: string };
  email: string;
  phone: string;
  cell: string;
  registered: { date: string };
  dob: { age: number };
  picture: { large: string };
}
//https://randomuser.me/api/portraits/men/32.jpg
@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  grouped: { letter: string; items: Contact[] }[] = [];
  loadingRandom = false;
  randomMessage = '';

  constructor(
    private router: Router,
    private contactService: ContactService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  private loadContacts() {
    this.contactService.getAll().subscribe({
      next: (data) => {
        this.contacts = data;
        this.groupContacts();
      },
      error: () => {
        this.randomMessage = 'Failed to load contacts';
      },
    });
  }

  private groupContacts() {
    const map = new Map<string, Contact[]>();
    this.contacts.forEach((c) => {
      const letter = c.name.charAt(0).toUpperCase() || '#';
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(c);
    });
    this.grouped = Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, items]) => ({ letter, items }));
  }

  goToDetail(id: string) {
    this.router.navigate(['/detail', id]);
  }

  newContact() {
    this.router.navigate(['/detail']);
  }

  addRandom() {
    if (this.loadingRandom) return;
    this.loadingRandom = true;
    this.randomMessage = 'Adding 10 random contacts...';

    this.http
      .get<{ results: RandomUser[] }>('https://randomuser.me/api/?results=10&nat=us,gb,au')
      .subscribe({
        next: (res) => {
          const promises = res.results.map((user) =>
            this.contactService.create({
              name: `${user.name.first} ${user.name.last}`,
              address: 'AllCloud', 
              email: user.email,
              phone: user.phone,
              cell: user.cell,
              registered: new Date(user.registered.date),
              age: user.dob.age,
              picture: user.picture.large,
            }).toPromise()
          );

          Promise.all(promises)
            .then(() => {
              this.loadingRandom = false;
              this.randomMessage = '10 random contacts added!';
              this.loadContacts(); // refresh the contact list
              setTimeout(() => (this.randomMessage = ''), 10000);
            })
            .catch(() => {
              this.loadingRandom = false;
              this.randomMessage = 'Failed to add some contacts';
            });
        },
        error: () => {
          this.loadingRandom = false;
          this.randomMessage = 'Failed to fetch random users';
        },
      });
  }
}