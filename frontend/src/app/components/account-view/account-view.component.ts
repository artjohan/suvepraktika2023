import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HelperService } from '../../services/helper.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit{

  constructor(private userService: UserService,
              private helperService: HelperService,
              private router: Router,
              private location: Location) {}

  currentUser: User | null = null;

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if(!this.currentUser) {
      this.router.navigateByUrl('/login');
    }
  }

  logout(): void {
    this.userService.removeCurrentUser();
    window.location.href = '/'
  }
}
