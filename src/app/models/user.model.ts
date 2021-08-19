export class User {
    email: string = '';
    firstname: string = '';
    lastname: string = '';
    password: string = '';
  
    constructor(email: string, firstname: string, lastname: string, password: string) {
      this.email = email;
      this.firstname = firstname;
      this.lastname = lastname;
      this.password = password;
    }
  }