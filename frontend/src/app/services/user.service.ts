import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USERS_KEY = 'users';

  constructor() { }

  private getUsers(): User[] {
    const usersData = localStorage.getItem(this.USERS_KEY);
    return usersData ? JSON.parse(usersData!) : [];
  }

  private setUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  addUser(user: User): void {
    const users = this.getUsers();
    user.id = uuidv4();
    users.push(user);
    this.setUsers(users);
  }

  getUser(userId: string): User | null{
    const users = this.getUsers();
    return users.find((user: User) => user.id === userId) || null;
  }

  isAvailable(username: string): boolean {
    const users = this.getUsers();
    return !users.some(user => user.username.toLowerCase() === username.toLowerCase());
  }

  userExists(username: string): boolean {
    const users = this.getUsers();
    return users.some(user => user.username === username);
  }

  verifyUser(username: string, password: string) {
    const users = this.getUsers()
    const matchedUser = users.find(user => {
      return user.username === username && user.password === password;
    })

    return matchedUser ? matchedUser : null;
  }
}
