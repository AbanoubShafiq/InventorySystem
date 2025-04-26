import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private userRoleSource = new BehaviorSubject<string>('guest'); 
  userRole$ = this.userRoleSource.asObservable();

  constructor() { }

  setUserRole(role: string) {
    this.userRoleSource.next(role); 
  }
}
