import { ICircle } from './../interfaces/circle.interface';
import { IProject } from './../interfaces/project.interface';

export class Project implements IProject {
  email: string = '';
  id: string = '';
  name: string = '';
  circles: ICircle[] = [];

  constructor(email: string = '', id: string = '', name: string = '', circles: ICircle[] = []) {
    this.email = email;
    this.id = id;
    this.name = name;
    this.circles = circles;
  }
}