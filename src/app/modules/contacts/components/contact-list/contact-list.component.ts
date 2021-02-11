import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ContactCreateComponent } from '../contact-create/contact-create.component';
import { Contact } from '../../../../contact.model';
import { DataService } from '../../services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[];
  private contactsSub: Subscription;
  selectedContact: Contact;
  @ViewChild('creatContact') creatContact;
  private modalRef;
  constructor(private dataService: DataService, private modalService: NgbModal) { }

  ngOnInit() {
    this.contactsSub = this.dataService.contacts.subscribe(contacts => {
      this.contacts = contacts;
      //Here I getting cords of each contact by his Address
      contacts.forEach(element => {
        this.dataService.getCords(element.address).subscribe(elm => {
          element.cords = elm;
        })
      });
    });
  }
  selectContact(contact) {
    this.selectedContact = contact;
  }

  edit(contact: Contact) {
    const modalRef = this.modalService.open(
      ContactCreateComponent,
      {
        centered: true,
        backdrop: 'static',
        keyboard: false
      }
    );
    modalRef.componentInstance.contact = contact;
  }

  delete(contactId: string) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this contact!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.dataService.delete(contactId).subscribe(() => {
          Swal.fire(
            'Deleted!',
            'Your contact has been deleted.',
            'success'
          )
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your contact is safe :)',
          'error'
        )
      }
    })
  }

  creatNewContact() {
    const modalRef = this.modalService.open(
      ContactCreateComponent,
      {
        centered: true,
        backdrop: 'static',
        keyboard: false
      }
    );
    modalRef.componentInstance.contact = null;
  }







  ngOnDestroy() {
    if (this.contactsSub) {
      this.contactsSub.unsubscribe();
    }
  }
}
