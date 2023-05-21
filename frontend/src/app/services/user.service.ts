import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'userData';

  constructor() { }

  getUserData(): { currentUser: User | null, allUsers: User[] } {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    return userData ? JSON.parse(userData) : { currentUser: null, allUsers: [] };
  }

  setUserData(data: { currentUser: User | null, allUsers: User[] }): void {
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
    const matchedUser = allUsers.find(userSearch => userSearch.id === user!.id)!;
    this.setUserData({ currentUser: matchedUser, allUsers });
  }

  getCurrentUser(): User | null {
    const { currentUser } = this.getUserData();
    return currentUser;
  }

  removeCurrentUser(): void {
    const users = this.getUserData();
    // save the current user into the allUsers array
    const allUsers = users.allUsers.filter(user => user.id !== users.currentUser!.id);
    allUsers.push(users.currentUser!);
    this.setUserData({ currentUser: null, allUsers });
  }
}
