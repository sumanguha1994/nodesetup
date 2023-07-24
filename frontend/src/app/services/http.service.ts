import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Global from 'src/app/global';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  readonly BASE_URL;
  constructor(private http: HttpClient) {
    this.BASE_URL = Global.API_URL;
  }

  get(uri: string, headers: any[] = []) {
    return this.http.get<any>(`${this.BASE_URL}/${uri}`, {
      headers: this.generateHeaders(headers),
    });
  }

  post(uri: string, payload: any, headers: any[] = []) {
    return this.http.post<any>(`${this.BASE_URL}/${uri}`, payload, {
      headers: this.generateHeaders(headers),
    });
  }

  postFormData(uri: string, payload: any, headers: any[] = []) {
    var formData = new FormData();
    for (var key in payload) {
      formData.append(key, payload[key]);
    }

    return this.http.post<any>(`${this.BASE_URL}/${uri}`, formData, {
      headers: this.generateHeaders(headers),
    });
  }

  /** PAGE FUNCTIONS */
  generateHeaders(hdrs: any[]) {
    let headers = new HttpHeaders();
    for (const key in hdrs) {
      if (Object.prototype.hasOwnProperty.call(hdrs, key)) {
        const value = hdrs[key];
        headers = headers.append(key, value);
      }
    }

    return headers;
  }
}
