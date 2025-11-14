import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  company?: string;  
}

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];


  grouped: { letter: string; items: Contact[] }[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    //  example static
    this.contacts = [
      {
        id: '1',
        name: 'Oudai Salameh',
        email: 'oudai@example.com',
        phone: '0507774864',
        picture: 'https://randomuser.me/api/portraits/men/32.jpg',
        company: 'Allcloud'
      },
      {
        id: '2',
        name: 'Ameer Salameh',
        email: 'ameer@gmail.com',
        phone: '050111111',
        picture: 'https://randomuser.me/api/portraits/women/68.jpg',
        company: 'Freelancer'
      },
      //add more later tomrrow as service
    ];

    this.groupContacts();
  }

  /* group by first letter (A-Z) */
  private groupContacts() {
    const map = new Map<string, Contact[]>();

    this.contacts.forEach(c => {
      const letter = (c.name.charAt(0).toUpperCase() || '#');
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
    // will be wired to randomuser.me tomrrow
    console.log('Add random records');
  }
}