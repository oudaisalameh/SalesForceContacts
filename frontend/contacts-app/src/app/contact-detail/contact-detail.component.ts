// src/app/contact-detail/contact-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ContactService, Contact } from '../contact.service';

function phoneValidator(control: any) {
  const valid = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,}[-\s\.]?[0-9]{3,}$/.test(control.value);
  return valid ? null : { phone: true };
}

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css'],
})
export class ContactDetailComponent implements OnInit {
  contact: Contact | null = null;
  form!: FormGroup;
  editMode = false;
  isNew = false;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService // inject
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadContact(id);
    } else {
      this.isNew = true;
      this.editMode = true;
      this.initForm({});
    }
  }

  private loadContact(id: string) {
    this.loading = true;
    this.contactService.getById(id).subscribe({
      next: (c) => {
        this.contact = c;
        this.initForm(c);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load contact';
        this.loading = false;
      },
    });
  }

  private initForm(data: any) {
    this.form = new FormGroup({
      name: new FormControl(data.name || '', [Validators.required, Validators.minLength(2)]),
      address: new FormControl(data.address || '', Validators.required),
      email: new FormControl(data.email || '', [Validators.required, Validators.email]),
      phone: new FormControl(data.phone || '', [Validators.required, phoneValidator]),
      cell: new FormControl(data.cell || ''),
      registered: new FormControl(
        data.registered
          ? new Date(data.registered).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        Validators.required
      ),
      age: new FormControl(data.age || '', [Validators.required, Validators.min(0), Validators.max(150)]),
      picture: new FormControl(data.picture || '', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]),
    });
  }

  edit() {
    this.editMode = true;
  }

  delete() {
    if (!this.contact?.id || !confirm('Delete this contact?')) return;
    this.router.navigate(['/']);
  }

  back() {
    this.router.navigate(['/']);
  }
  save() {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.error = '';

    const raw = this.form.getRawValue();
    const payload: Contact = {
      ...raw,
      id: this.contact?.id,
      registered: new Date(raw.registered),
      age: Number(raw.age),
    };

    const request$ = this.isNew
      ? this.contactService.create(payload)
      : this.contactService.update(payload.id!, payload);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to save contact';
      },
    });
  }
}