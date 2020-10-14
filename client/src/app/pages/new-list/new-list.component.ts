import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { Router } from '@angular/router';
import { List } from 'src/app/interfaces/list';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss'],
})
export class NewListComponent implements OnInit {
  constructor(private tasksService: TasksService, private router: Router) {}

  ngOnInit(): void {}

  createNewList(title: string) {
    this.tasksService.createList(title).subscribe((list: List) => {
      this.router.navigate(['/lists', list._id]);
    });
  }
}
