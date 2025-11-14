import { Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';  // Add this

export const routes: Routes = [
  { path: '', component: ContactListComponent },
  { path: 'detail', component: ContactDetailComponent },
  { path: 'detail/:id', component: ContactDetailComponent }
];