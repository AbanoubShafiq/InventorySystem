import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable ,of} from 'rxjs';
import { Login } from '../_models/login';
import { register } from '../_models/register';
import { userProfile } from '../_models/userProfile.model';
// import * as jwt from 'jsonwebtoken';
// import { default as jwt_decode } from 'jwt-decode';
// import {default as jwt_decode} from "jwt-decode"
import {jwtDecode }from 'jwt-decode';
import { Order } from '../_models/order.module';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiUrl = 'http://localhost:5000/users';
  
  constructor(
    private http: HttpClient,
    private cookieSer:CookieService
  ) { }


  // login 
  login(loginData:Login): Observable<Login>
  {
    return this.http.post<Login>(`${this.apiUrl}/login`,loginData);
  }
  // register
  register(userData:register): Observable<register>
  {
    return this.http.post<register>(`${this.apiUrl}/register`,userData)
  }

  getUserDataByEmail(email: string) {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<userProfile>(`${this.apiUrl}/getUserByEmail/${email}`, { headers });
  }
  updateUserData(userData:userProfile, id:string)
  {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put<userProfile>(`${this.apiUrl}/updateUser/${id}`,userData, {headers})
  }
  

  // decode token
  // decodeToken(token: string): any {
  //   try {
  //     return jwtDecode(token);
  //   } catch (error) {
  //     console.error('Invalid token', error);
  //     return null;
  //   }
  // }


  decodeToken(token: string): Observable<any> {
    try {
      const decoded = jwtDecode(token);
      return of(decoded); // Wrapping it in an Observable
    } catch (error) {
      console.error('Invalid token', error);
      return of(null); // Returning null inside an Observable
    }
  }


  // request password to change 
  requestChangePassword (email:string): Observable<any>
  {
    return this.http.post(`${this.apiUrl}/requestPasswordReset/${email}`, {});
  }
  // reset password
  
  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    const body = {
        email: email,
        token: token,
        newPassword: newPassword
    };
    return this.http.post(`${this.apiUrl}/resetPassword`, body);
}


  isAuthenticated(): boolean
  {
    return this.cookieSer.check("token");
  }


  logout() {
    this.cookieSer.deleteAll();
  }



}
