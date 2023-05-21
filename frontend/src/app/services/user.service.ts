import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'userData';

  constructor() { }

  private getUserData(): { currentUser: User | null, allUsers: User[] } {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    console.log(JSON.parse(userData!).currentUser)
    return userData ? JSON.parse(userData) : { currentUser: null, allUsers: [] };
  }

  private setUserData(data: { currentUser: User | null, allUsers: User[] }): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  updateCurrentUserData(currentUser: User | null) {
    var allUserData = this.getUserData();
    allUserData.currentUser = currentUser;
    this.setUserData(allUserData);
  }

  addUser(user: User): void {
    const { currentUser, allUsers } = this.getUserData();
    user.id = uuidv4();
    allUsers.push(user);
    this.setUserData({ currentUser, allUsers });
  }

  getUser(userId: string): User | null {
    const { allUsers } = this.getUserData();
    return allUsers.find((user: User) => user.id === userId) || null;
  }

  isAvailable(username: string): boolean {
    const { allUsers } = this.getUserData();
    return !allUsers.some(user => user.username.toLowerCase() === username.toLowerCase());
  }

  userExists(username: string): boolean {
    const { allUsers } = this.getUserData();
    return allUsers.some(user => user.username === username);
  }

  verifyUser(username: string, password: string) {
    const { allUsers } = this.getUserData();
    const matchedUser = allUsers.find(user => user.username === username && user.password === password);
    return matchedUser ? matchedUser : null;
  }

  setCurrentUser(user: User | null): void {
    const { allUsers } = this.getUserData();
    this.setUserData({ currentUser: user, allUsers });
  }

  getCurrentUser(): User | null {
    const { currentUser } = this.getUserData();
    return currentUser;
  }

  removeCurrentUser(): void {
    var users = this.getUserData();
    users.currentUser = null;
    this.setUserData(users);
  }
}
