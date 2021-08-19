import { Component, OnInit } from '@angular/core';
import { ICircle } from '../interfaces/circle.interface';
import { Circle } from './../models/circle.model';
import { ECircleCount } from '../enums/circle-count.enum';
import { LocalStorageService } from '../services/storage.service';
import { IProject } from '../interfaces/project.interface';
import { Router } from '@angular/router';
import { Project } from './../models/project.model';
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
  selectedProjectId: string = '';
  projectList: Project[] = [];
  currentProjectList: Project[] = [];
  projectListName = 'circlesProject';
  canvasSizes: number[] = [
    ECircleCount.MIN, // 100
    ECircleCount.MID, // 225
    ECircleCount.MAX, // 400
  ];
  selectedSize: number = this.canvasSizes[0];
  currentColor: string = '#000';
  isProjectClicked: boolean = false;
  email!: string;
  // mouseDown$!: Observable<any>;
  // mouseUp$!: Observable<any>;

  constructor(private storage: LocalStorageService, private route: Router) {}

  ngOnInit(): void {
    const email = this.storage.get('currentUser');
    !email ? this.logout() : this.getProjects(email);
  }

  onGenerateCircles(): void {
    this.resetColors();
  }

  onSizeSelect(): void {
    if (this.isEmpty(this.circles)) {
      return;
    }
    this.resetColors();
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
      this.circles.push(new Circle(i, this.newId(), ''));
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
    this.projectList.map((elem) => {
      if (elem.name === this.projectName) {
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
      alert('For save you must create a project then add a unique name')
      return;
    }
    const project = new Project(
      this.storage.get('currentUser') || '',
      this.newId(),
      this.projectName,
      this.circles
    );
    this.addToProjectList(project);
  }

  onEdit(): void {
    if (
      this.isEmpty(this.circles) ||
      !this.projectName
    ) {
      alert('For edit you must load a project then save it')
      return;
    }
    let project = new Project();
    this.currentProjectList.map((elem, index) => {
      if (elem.id === this.selectedProjectId) {
        project = this.currentProjectList[index];
        this.currentProjectList.splice(index, 1);
      }
    })
    this.projectList.map((elem, index) => {
      if (elem.id === this.selectedProjectId) {
        this.projectList.splice(index, 1);
      }
    })
    project.name = this.projectName;
    this.projectName = '';
    this.addToProjectList(project);
  }

  onDelete(i: number): void {
    this.projectList.splice(i, 1);
    this.currentProjectList.splice(i, 1);
    this.setInStorage();
    if (this.currentProjectList.length === 0) {
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
  getProjects(email: string): void {
    this.currentProjectList = [];
    const projects = this.storage.get(this.projectListName);
    if (projects) {
      this.projectList = JSON.parse(projects);
      this.projectList.map((elem) => {
        if (elem.email === email) {
          this.currentProjectList.push(elem);
        }
      });
    }
  }

  selectProject(project: IProject): void {
    //this.onHoldDelete()
    this.circles = project.circles;
    this.selectedSize = project.circles.length;
    this.projectName = project.name;
    this.selectedProjectId = project.id;
    this.isProjectClicked = true;
  }

  logout(): void {
    this.storage.remove('currentUser');
    this.route.navigate(['/']);
  }

  onInputChange(event: any): void {
    if (event.target.value) {
      this.projectName = event.target.value;
    }
  }

  addToProjectList(project: Project): void {
    if (project.id) {
      this.projectList.push(project);
      this.currentProjectList.push(project);
      const projectsStr = JSON.stringify(this.projectList);
      this.storage.set(this.projectListName, projectsStr);
      this.projectName = '';
    }
  }
}
