import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

// phone numbers like 050-777-4864 or +972 (050) 777-4864
function phoneValidator(control: AbstractControl): ValidationErrors | null {
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
  contact: any = null;
  form!: FormGroup;
  editMode = false;
  isNew = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      //first idle example , tomorrow connect the db
      this.contact = {
        id,
        name: 'Oudai Salameh',
        address: 'TiratCarmel',
        email: 'oudai@gmail.com',
        phone: '050-777-4864',
        cell: '050-777-4864',
        registered: new Date('2023-11-14'),
        age: 26,
        picture: 'https://randomuser.me/api/portraits/men/32.jpg',
      };
      this.initForm(this.contact);
    } else {
      this.isNew = true;
      this.editMode = true;
      this.initForm({});
    }
  }
 // initialize form
  private initForm(data: any) {
    this.form = new FormGroup({
      name: new FormControl(data.name || '', [
        Validators.required,
        Validators.minLength(2),
      ]),
      address: new FormControl(data.address || '', Validators.required),
      email: new FormControl(data.email || '', [
        Validators.required,
        Validators.email,
      ]),
      phone: new FormControl(data.phone || '', [
        Validators.required,
        phoneValidator,
      ]),
      cell: new FormControl(data.cell || ''),
      registered: new FormControl(
        data.registered
          ? new Date(data.registered).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        Validators.required
      ),
      age: new FormControl(data.age || '', [
        Validators.required,
        Validators.min(0),
        Validators.max(150),
      ]),
      picture: new FormControl(data.picture || '', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+/),
      ]),
    });
  }

  //  UI actions 
  edit() {
    this.editMode = true;
  }

  delete() {
    if (confirm('Delete this contact?')) {
      // TODO: service.delete() for tomorrow
      this.router.navigate(['/']);
    }
  }

  save() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      registered: new Date(raw.registered),
      age: Number(raw.age),
    };

    // TODO: service.create() or service.update() for tomorrow
    console.log('Saving:', payload);
    this.router.navigate(['/']);
  }
}