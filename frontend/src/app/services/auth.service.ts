import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpService: HttpService,
    private router: Router,
    private http: HttpClient
  ) {}

  /**
   * ====================================================
   * Admin Authentication Methods
   *
   * Token Name - admin-template-token
   * User Details - admin-template-user
   * ====================================================
   * */

  adminLogin(payload: any) {
    return this.httpService.post('auth/admin/login', payload);
  }

  doAdminLogin(data: any) {
    localStorage.setItem('admin-template-token', data.token);
    localStorage.setItem('admin-template-user', JSON.stringify(data.user));
  }

  setAdminUser(data: any) {
    localStorage.setItem('admin-template-user', JSON.stringify(data));
  }

  adminLogout() {
    localStorage.removeItem('admin-template-token');
    localStorage.removeItem('admin-template-user');
    this.router.navigate(['/login']);
  }

  adminLoggedIn() {
    return !!localStorage.getItem('admin-template-token');
  }

  getAdminToken() {
    return localStorage.getItem('admin-template-token');
  }

  // getAdminAccountDetails() {
  //   var token = localStorage.getItem('admin-template-token');
  //   console.log('token', token);
  //   let httpOptions = {
  //     headers: new HttpHeaders({
  //       'Access-Control-Allow-Origin': '*',
  //       'x-access-token': `${token}`,
  //       //'token':this.token
  //     }),
  //   };

  //   // return this.http.post<any>(Global.API_URL+'/auth/admin/getaccount', {}, httpOptions)

  //   // return this.httpService.post('auth/admin/getaccount', {});

  //   // const headers = new Headers({
  //   //   'Content-Type': 'application/json',
  //   //   'x-access-token': `${token}`
  //   // })
  //   // var payload :any = '';
  //   // return this.httpService.post('auth/admin/getaccount',{payload,headers})

  //   // var headers_object = new HttpHeaders({
  //   //   'Content-Type': 'application/json',
  //   //    'x-access-token': `${token}`
  //   // });

  //   //     var httpOptions :any  = {
  //   //       headers: headers_object
  //   //     };

  //   // // setHeaders: {
  //   // //            'x-access-token': `${authService.getToken()}`,
  //   // //      },
  //   // return this.httpService.post('auth/admin/getaccount', {},httpOptions);
  // }

  getAdminAccountDetails() {
    return this.httpService.post('auth/admin/getaccount', '', []);
  }

  /**
   * =====================================================
   * End of Admin Authentication Methods
   * =====================================================
   * */

  getToken() {
    if (this.getAdminToken()) {
      return localStorage.getItem('admin-template-token');
    } else {
      return null;
    }
  }
}
