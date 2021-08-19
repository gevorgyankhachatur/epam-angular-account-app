import { ICircle } from './../interfaces/circle.interface';

export class Circle implements ICircle {
  id!: number;
  uid!: string;
  color!: string;

  constructor(id: number, uid: string, color: string) {
    this.id = id;
    this.uid = uid;
    this.color = color;
  }
}