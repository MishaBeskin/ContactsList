import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../../../contact.model';
import { take, map, tap, delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  contactId: string;
  cords: string;

  private _contacts = new BehaviorSubject<Contact[]>([
    new Contact(
      "1",
      "assets/avatars/alex jonathan.jpg",
      "CEO",
      "Alex Johantan",
      "c004@email.com",
      972521234567,
      "Google",
      "409 Illinois St San Francisco, CA 94158",
      ""
    ),
    new Contact(
      "2",
      "assets/avatars/janeth carton.jpg",
      "Graphic designer",
      "Janeth Carton",
      "c004@email.com",
      972521234567,
      "Google",
      "409 Illinois St San Francisco, CA 94158",
      ""
    ),
    new Contact(
      "3",
      "assets/avatars/john-smith.jpg",
      "Graphic designer",
      "John Smith",
      "c004@email.com",
      972521234567,
      "Google",
      "409 Illinois St San Francisco, CA 94158",
      ""
    ),
    new Contact(
      "4",
      "assets/avatars/michael zimber.jpg",
      "Sales manger",
      "Micheal Zimber",
      "c004@email.com",
      972521234567,
      "Google",
      "409 Illinois St San Francisco, CA 94158",
      ""
    ),
    new Contact(
      "5",
      "assets/avatars/monica smith.jpg",
      "Marketing manger",
      "Monica Smith",
      "c004@email.com",
      972521234567,
      "Google",
      "409 Illinois St San Francisco, CA 94158",
      ""
    ),
    new Contact(
      "6",
      "assets/avatars/sandra smith.jpg",
      "Graphic designer",
      "Sandra Smith",
      "c004@email.com",
      972521234567,
      "Google",
      "409 Illinois St San Francisco, CA 94158",
      ""
    ),
    new Contact(
      "7",
      "assets/avatars/michael zimber.jpg",
      "Sales manger",
      "Micheal Zimber",
      "c004@email.com",
      972521234567,
      "Google",
      "409 Illinois St San Francisco, CA 94158",
      ""
    ),
    new Contact(
      "8",
      "assets/avatars/janeth carton.jpg",
      "Graphic designer",
      "Janeth Carton",
      "c004@email.com",
      972521234567,
      "Google",
      "409 Illinois St San Francisco, CA 94158",
      ""
    ),
  ]);


  get contacts() {
    return this._contacts.asObservable();
  }

  constructor(private http: HttpClient) { }

  getContact(id: string) {
    return this.contacts.pipe(
      take(1),
      map(contacts => {
        const temp = contacts.find(c => c.id === id);
        return temp ? { ...temp } : null;
      })
    );
  }


  public createContact(
    jobTitle: string,
    name: string,
    email: string,
    tell: number,
    company: string,
    address: string
  ) {
    const newContact = new Contact(
      Math.floor(Math.random() * 100).toString(),
      "assets/avatars/initial.jpg",
      jobTitle,
      name,
      email,
      tell,
      company,
      address,
      ""
    );
    return this.contacts.pipe(
      take(1),
      delay(1000),
      tap(contacts => {
        this.getCords(newContact.address).subscribe(elm => {
          newContact.cords = elm;
        })
        this._contacts.next(contacts.concat(newContact));
      })
    );
  }




  //Because you provide me with Google Map Apikey that not valid,
  // I did not mange to test it and complete the task as needed!
  getCords(address?: any): Observable<string> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&paris&key=AIzaSyDKvvBgAkSCugEbXckutuAFuqPzthsCnJ8`;
    return this.http.get(url).pipe(
      map((data: any) => data.map((item: any) => {
        this.cords = item;
      }))
    )
  }

  updateContact(
    contactId: string,
    jobTitle: string,
    name: string,
    email: string,
    tell: number,
    company: string,
    address: string
  ) {
    return this.contacts.pipe(
      take(1),
      delay(1000),
      tap(contacts => {
        const updatedContactIndex = contacts.findIndex(con => con.id === contactId);
        const updatedContacts = [...contacts];
        const oldContact = updatedContacts[updatedContactIndex];
        updatedContacts[updatedContactIndex] = new Contact(
          oldContact.id,
          oldContact.avatarUrl,
          jobTitle,
          name,
          email,
          tell,
          company,
          address,
          ""
        );
        this._contacts.next(updatedContacts);
        this.contactId = null;
      })
    );
  }

  delete(contactId: string) {
    return this.contacts.pipe(
      take(1),
      delay(1000),
      tap(contacts => {
        this._contacts.next(contacts.filter(c => c.id !== contactId));
      })
    );
  }

}
