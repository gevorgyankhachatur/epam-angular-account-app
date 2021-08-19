import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from './../models/user.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.html']
})
export class SignInComponent implements OnInit {
  users: User[] = [];
  wrongValues: boolean = false;
  submitted: boolean = false;
  signInForm: any;

  constructor(private storage: LocalStorageService, private route: Router, private userService: UserService, private formBuilder: FormBuilder) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const email = this.storage.get('currentUser');
    if (email) {
      this.login(email);
    }
  }
  email() {
    return this.signInForm.get('email') as FormControl;
  }
  password() {
    return this.signInForm.get('password') as FormControl;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.signInForm.valid) {
      this.wrongValues = true;
      const users = this.userService.getUsers();
      users.map(elem => {
        if (elem.email === this.email().value && elem.password === this.password().value) {
          this.login(elem.email);
        }
      });
    } else {
      this.signInForm.markAllAsTouched();
    }
  }

  login(email: string): void {
    this.wrongValues = false;
    this.storage.set('currentUser', email);
    this.route.navigate(['/paint']);
  }
}