import { Injectable } from '@angular/core';
import { BackEndService } from './back-end.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private backendService: BackEndService) { }

  user?: any[];

  setUserId(id: any) {
    localStorage.clear();
    localStorage.setItem('userId', id);
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  setAdminId(id: any) {
    localStorage.clear();
    localStorage.setItem('AdminId', id);
  }

  getAdminId() {
    return localStorage.getItem('AdminId');
  }
}
