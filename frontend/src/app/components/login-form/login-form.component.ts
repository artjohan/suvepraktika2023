import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

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

  currentUser?: User | null;

  showPassword: boolean = false;
  passwordErr: string = "Password is required";

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  usernameExistenceValidator() {
    return (control: AbstractControl) => {
      return this.userService.userExists(control.value) ? null : { usernameDoesNotExist: true };
    };
  }

  ngOnInit(): void {
    console.log(this.currentUser)
  }

  login(): void {
    if(this.userForm.valid) {
      this.currentUser = this.userService.verifyUser(this.userForm.value.username, this.userForm.value.password)
      if(this.currentUser) {
        console.log(this.currentUser)
      } else {
        console.log(this.currentUser)
        this.passwordErr = "Incorrect password"
        this.userForm.get("password")?.reset();
      }
    }
  }
}
