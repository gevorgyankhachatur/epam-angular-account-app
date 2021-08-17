import { Component, OnInit } from '@angular/core';
import { ICircle } from '../interfaces/circle.interface';
import { ECircleCount } from '../enums/circle-count.enum';
import { LocalStorageService } from '../services/storage.service';
import { IProject } from '../interfaces/project.interface';
//import { delay, takeUntil, tap } from 'rxjs/operators';
//import { fromEvent, pipe, Observable } from 'rxjs';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements OnInit {
  circles: ICircle[] = [];
  projectName: string = '';
  projectList: IProject[] = [];
  projectListName = 'circlesProject';
  canvasSizes: number[] = [
    ECircleCount.MIN, // 100
    ECircleCount.MID, // 225
    ECircleCount.MAX, // 400
  ];
  selectedSize: number = this.canvasSizes[0];
  currentColor: string = '#000';
 // mouseDown$!: Observable<any>;
 // mouseUp$!: Observable<any>;

  constructor(private storage: LocalStorageService) {}

  ngOnInit(): void {
    this.getProjects();
    console.log(this.projectList);
  }

  onGenerateCircles(): void {
    this.resetColors();
    console.log('this.circles: ', this.circles);
  }

  onSizeSelect(): void {
    this.circles = [];
  }

  onCircleClick(circle: ICircle): string {
    return (this.circles[circle.id].color =
      this.currentColor !== circle.color ? this.currentColor : '');
  }

  onResetColor(): void {
    if (!this.isEmpty(this.circles)) {
      this.resetColors();
    }
  }

  resetColors(): void {
    this.circles = [];
    for (let i = 0; i < this.selectedSize; i++) {
      this.circles.push({
        id: i,
        uid: this.newId(),
        color: '',
      });
    }
  }

  onFillCircles(): void {
    if (this.isEmpty(this.circles)) {
      return;
    }
    this.circles.forEach((item) => {
      item.color = this.currentColor;
    });
  }

  isEmpty(arr: ICircle[]): boolean {
    return !arr.length;
  }

  newId(): string {
    return String(Date.now());
  }

  setInStorage() {
    const projectsStr = JSON.stringify(this.projectList);
    this.storage.set(this.projectListName, projectsStr);
  }

  onSave(): void {
    let isProjectNameUnique = true;
    this.projectList.map((el) => {
      if (el.name === this.projectName) {
        alert('Already exists project with this name');
        isProjectNameUnique = false;
        return;
      }
    });
    if (
      this.isEmpty(this.circles) ||
      !this.projectName ||
      !isProjectNameUnique
    ) {
      return;
    }
    this.projectList.push({
      id: this.newId(),
      name: this.projectName,
      circles: this.circles,
    });
    this.setInStorage();
    this.projectName = '';
  }

  onDelete(i: number): void {
    this.projectList.splice(i, 1);
    this.setInStorage();
    if (this.projectList.length === 0) {
      this.resetColors();
    }
  }

  /*
onHoldDelete(i: number) {
  this.mouseDown$.pipe(
    delay(3000),
    takeUntil(this.mouseUp$)
  )
    .subscribe(res => { this.projectList.splice(i, 1);
      this.setInStorage();
      if (this.projectList.length === 0) {
        this.resetColors();
      }});
}
*/
  getProjects(): void {
    const projects = this.storage.get(this.projectListName);
    if (projects) {
      this.projectList = JSON.parse(projects);
    }
  }

  selectProject(project: IProject): void {
    //this.onHoldDelete()
    this.circles = project.circles;
    this.selectedSize = project.circles.length;
  }
}
