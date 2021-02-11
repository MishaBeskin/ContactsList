import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  editContactSub: Subscription;
  editContact = undefined;
  @Input() contact;
  constructor(private dataService: DataService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.form = new FormGroup({
      jobTitle: new FormControl(this.contact ? this.contact.jobTitle : null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      name: new FormControl(this.contact ? this.contact.name : null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      email: new FormControl(this.contact ? this.contact.email : null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      }),
      tell: new FormControl(this.contact ? this.contact.tell : null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      company: new FormControl(this.contact ? this.contact.company : null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      address: new FormControl(this.contact ? this.contact.address : null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onCreateContact() {
    if (!this.form.valid) {
      return;
    }
    if (!this.contact) {
      return this.dataService.createContact(
        this.form.value.jobTitle,
        this.form.value.name,
        this.form.value.email,
        this.form.value.tell,
        this.form.value.company,
        this.form.value.address
      ).subscribe(() => {
        this.form.reset();
        this.activeModal.close();
      });
    } else {
      return this.dataService.updateContact(
        this.contact.id,
        this.form.value.jobTitle,
        this.form.value.name,
        this.form.value.email,
        this.form.value.tell,
        this.form.value.company,
        this.form.value.address
      ).subscribe(() => {
        this.form.reset();
        this.activeModal.close();
      });
    }
  }



  ngOnDestroy() {
    if (this.editContactSub) {
      this.editContactSub.unsubscribe();
    }
  }



}
