import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  userForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3), this.usernameAvailabilityValidator(), this.whitespaceValidator()]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required]
  });

  currentUser: User | null = null;
  showPassword: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,) { }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if(this.currentUser) {
      this.router.navigateByUrl('/account');
    }
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const user: User = {
        id: uuidv4(),
        username: this.userForm.value.username,
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        password: this.userForm.value.password,
        role: this.userForm.value.role
      };
      this.userService.addUser(user);
      this.userService.setCurrentUser(user);
      window.location.href = '/'
    }
  }

  usernameAvailabilityValidator() {
    return (control: AbstractControl) => {
      return this.userService.isAvailable(control.value) ? null : { usernameUnavailable: true };
    };
  }

  whitespaceValidator() {
    return (control: AbstractControl) => {
      return control.value.includes(' ') ? { usernameInvalid: true } : null;
    };
  }
}
