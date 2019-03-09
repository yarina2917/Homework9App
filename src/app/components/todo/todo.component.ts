import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TodoItem } from './todoitem';
import { UserService } from '../../services/user.service';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})

export class TodoComponent implements OnInit {

  public userList: TodoItem[];
  public editItemValue: boolean;
  public newTitle: string;
  public newDescription: string;
  public filterButton: string;
  public selectedFile: File;
  public imgUrl: string;

  private currentId: string;
  private currentIndex: number;

  public todoForm: FormGroup = this.fb.group({
    title: [''],
    description: ['']
  });

  constructor(
    private api: TodoService,
    private auth: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getList();
    this.editItemValue = false;
    this.filterButton = 'need';
  }

  public getList(): void {
    this.api.get().subscribe((res) => {
      this.userList = res;
    });
  }

  public filterList(value: string): void {
    this.filterButton = value;
  }

  public filter(status: string): boolean {
    if (this.filterButton === 'need' && status === 'need') {
      return true;
    }
    if (this.filterButton === 'done' && status === 'done') {
      return true;
    }
    if (this.filterButton === 'all') {
      return true;
    }
    return false;
  }

  public postItem(): void {
    const body = {
      userId: this.auth.getToken(),
      title: this.todoForm.controls.title.value,
      description: this.todoForm.controls.description.value,
      status: 'need',
      selected: false
    };
    this.api.post(body).subscribe((res) => {
      this.userList.push(res);
      this.todoForm.reset();
    });
  }

  public doneItem(id: string, index: number): void {
    this.api.changeToDo({status: 'done'}, id).subscribe(() => {
      this.userList[index].status = 'done';
    });
  }

  public unDone(id: string, index: number): void {
    this.api.changeToDo({status: 'need'}, id).subscribe(() => {
      this.userList[index].status = 'need';
    });
  }

  public editItem(item: TodoItem, index: number): void {
    this.editItemValue = true;
    this.currentId = item._id;
    this.currentIndex = index;
    this.newTitle = item.title;
    this.newDescription = item.description;
  }

  public saveChanges(): void {
    this.editItemValue = false;
    const body = {title: this.newTitle, description: this.newDescription};
    this.api.changeToDo(body, this.currentId).subscribe(() => {
      this.userList[this.currentIndex].title = this.newTitle;
      this.userList[this.currentIndex].description = this.newDescription;
    });
  }

  public cancelChanges(): void {
    this.editItemValue = false;
  }

  public deleteItem(id: string, index: number): void {
    this.api.delete(id).subscribe(() => {
      this.userList.splice(index, 1);
    });
  }

  public onFileChanged(event: any, id: string, index: number): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.addEventListener('load', (event: any) => {
        this.imgUrl = event.target.result;
        this.api.changeToDo({selected: this.imgUrl}, id).subscribe(() => {
          this.userList[index].selected = this.imgUrl;
        });
      });
    }
  }

  public removeImage(id: string, index: number): void {
    this.api.changeToDo({selected: false}, id).subscribe(() => {
      this.userList[index].selected = false;
    });
  }

  public trackById(index: number, item: TodoItem): string {
    return item._id;
  }
}
