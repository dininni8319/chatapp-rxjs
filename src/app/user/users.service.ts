import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // stream which we will use to manage our current user
  // Subject "read/write" stream
  // BehaviorSubject has a special property in that it stores the last value /
  // Meaning that any subscriber to the stream will receive the latest value.
  currentUser: Subject<User | null> = new BehaviorSubject<User | null>(null)
  constructor() { }
  
  // We will use the setCurrentUser method to set the current user
  public setCurrentUser(newUser: User): void {
    this.currentUser.next(newUser)
  }
}

export const userServiceInjectables: Array<any> = [ 
  UsersService
];
