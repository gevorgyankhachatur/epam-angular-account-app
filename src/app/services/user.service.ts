import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { LocalStorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userListName = 'users'

  constructor(private storage: LocalStorageService) { }

  getUsers(): User[] {
    const usersInLocal = this.storage.get(this.userListName);
    if (usersInLocal) {
      return JSON.parse(usersInLocal);
    }
    return [];
  }
}