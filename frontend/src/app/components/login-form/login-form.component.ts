import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  userForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3), this.usernameExistenceValidator()]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  currentUser: User | null = null;
  showPassword: boolean = false;
  passwordErr: string = "Password is required";

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,) { }

  usernameExistenceValidator() {
    return (control: AbstractControl) => {
      return this.userService.userExists(control.value) ? null : { usernameDoesNotExist: true };
    };
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if(this.currentUser) {
      this.router.navigateByUrl('/account');
    }
  }

  login(): void {
    if(this.userForm.valid) {
      const user = this.userService.verifyUser(this.userForm.value.username, this.userForm.value.password)
      if(user) {
        this.userService.setCurrentUser(user);
        window.location.href = '/'
      } else {
        this.passwordErr = "Incorrect password";
        this.userForm.get("password")?.reset();
      }
    }
  }
}
