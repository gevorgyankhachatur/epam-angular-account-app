import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { LocalStorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';
import { MustMatch, UniqueEmail } from '../validators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  submitted: boolean = false;
  signUpForm: any;
  users: User[] = [];

  constructor(private formBuilder: FormBuilder, private storage: LocalStorageService, private userService: UserService, private route: Router) {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z.-]+\\.[a-z]{2,4}$')]],
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: [MustMatch('password', 'confirmPassword'), UniqueEmail('email', userService.getUsers())]
    });
  }

  email() {
    return this.signUpForm.get('email') as FormControl;
  }

  firstname() {
    return this.signUpForm.get('firstname') as FormControl;
  }

  lastname() {
    return this.signUpForm.get('lastname') as FormControl;
  }

  password() {
    return this.signUpForm.get('password') as FormControl;
  }

  confirmPassword() {
    return this.signUpForm.get('confirmPassword') as FormControl;
  }

  onSubmit(): void { 
    this.submitted = true;   
    if (this.signUpForm.valid) {
      this.users.push(new User(this.email().value, this.firstname().value, this.lastname().value, this.password().value));
      const usersStr = JSON.stringify(this.users);
      this.storage.set(this.userService.userListName, usersStr);
      this.storage.set('currentUser', this.email().value);
      this.route.navigate(['/']);
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.users = this.userService.getUsers();
  }
}
