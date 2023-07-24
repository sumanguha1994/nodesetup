import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Global from 'src/app/global';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpService: HttpService, private http: HttpClient) {}

  /**
   * ADMIN PROFILE APIs
   * -----------------------
   * */

  updateAdminProfile(payload: any) {
    return this.httpService.post('admin/profile/update', payload);
  }

  /**
   * MEMBERS PROFILE APIs
   * -----------------------
   * */

  fetchMembers(payload: any) {
    // var token = localStorage.getItem('admin-template-token');
    // let httpOptions = {
    //   headers: new HttpHeaders({
    //     'Access-Control-Allow-Origin': '*',
    //     'x-access-token': `${token}`,
    //     //'token':this.token
    //   }),
    // };
    // return this.http.get<any>(
    //   Global.API_URL + '/admin/members/view',
    //   httpOptions
    // );
    return this.httpService.get('admin/members/view', payload);
  }

  createMembers(payload: any) {
    return this.httpService.post('admin/members/add', payload);
  }

  updateMembers(payload: any) {
    return this.httpService.post('admin/members/edit', payload);
  }

  changeStatus(payload: any) {
    return this.httpService.post('admin/members/change-status', payload);
  }
}
