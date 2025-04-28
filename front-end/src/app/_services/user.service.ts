import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable ,Subject} from 'rxjs';
import { User } from '../_models/user.model';
import { tap} from 'rxjs/operators';
import { Login } from '../_models/login';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/users';
  private userUpdated = new Subject<User>();
    constructor(private http: HttpClient) { }
  
    getAllUsers(): Observable<User[]> {
      return this.http.get<User[]>(`${this.apiUrl}/getAllUsers`);
    }
    getUsersBasedOnRole(role: string): Observable<User[]> {
      return this.http.get<User[]>(`${this.apiUrl}/getUsersBasedOnRole/${role}`);
    }

    getUserById(id: string): Observable<User> {
      return this.http.get<User>(`${this.apiUrl}/getUserById/${id}`);
    }

    getUserByEmail(email: string): Observable<User> {
      return this.http.get<User>(`${this.apiUrl}/getUserByEmail/${email}`);
    }

    createUser(user: User): Observable<User> {
      const userData = JSON.parse(JSON.stringify(user));
      delete userData._id;
        console.log('Adding user:', userData);
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<User>(`${this.apiUrl}/register`, userData,{headers}).pipe(
            tap(createdUser => {
                console.log('user added successfully:', createdUser);
            })
        );
      }
  
    updateUser(id: string, user: User): Observable<User> {
      console.log('Updating user at:', `${this.apiUrl}/updateUser/${id}`);
        return this.http.put<User>(`${this.apiUrl}/updateUser/${id}`, user).pipe(
          tap(updateUser => {
            console.log('Update successful:', updateUser);
            this.userUpdated.next(updateUser);
          })
        );
    }
    activeUser(id: string, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/activateUser/${id}`, user).pipe(
          tap(updateUser => {
            console.log('Update successful:', updateUser);
            this.userUpdated.next(updateUser);
          })
        );
    }
    inActiveUser(id: string, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/deactivateUser/${id}`, user).pipe(
          tap(updateUser => {
            console.log('Update successful:', updateUser);
            this.userUpdated.next(updateUser);
          })
        );
    }

    changeUserRole(id: string, role: string): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/changeUserRole/${id}`, {role}).pipe(
          tap(updateUser => {
            console.log('Update successful:', updateUser);
            this.userUpdated.next(updateUser);
          })
        );
    }
    
    deleteUser(id: string): Observable<void> {
        console.log('Deleting User at:', `${this.apiUrl}/deleteUser/${id}`);
        return this.http.delete<void>(`${this.apiUrl}/deleteUser/${id}`).pipe(
          tap(() => console.log('Delete successful'))
        );
      }
      onUserUpdate(): Observable<User> {
          return this.userUpdated.asObservable();
      }
}
