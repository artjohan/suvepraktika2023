import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  currentUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
  }
}
