import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TasksService } from 'src/app/services/tasks.service';
import { List } from 'src/app/interfaces/list';
import { Task } from 'src/app/interfaces/task';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists: List[];
  tasks: Task[];

  selectedListId: string;

  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params.listId) {
        this.selectedListId = params.listId;
        this.tasksService
          .getTasks(params.listId)
          .subscribe((tasks: Task[]) => (this.tasks = tasks));
      } else {
        this.tasks = undefined;
      }
    });

    this.tasksService
      .getLists()
      .subscribe((lists: List[]) => (this.lists = lists));
  }

  onTaskClick(task: Task) {
    this.tasksService
      .completeTask(task)
      .subscribe(() => (task.completed = !task.completed));
  }

  onTaskDelete(taskId: string) {
    if(confirm('Are you sure you want to delete?')) {
      this.tasksService
      .deleteTask(this.selectedListId, taskId)
      .subscribe((res: any) => {
        this.tasks = this.tasks.filter((task) => task._id !== taskId);
      });
    }
  }

  onDeleteList() {
    if (confirm('Are you sure you want to delete?')) {
      this.tasksService
      .deleteList(this.selectedListId)
      .subscribe((res: any) => {
        this.router.navigate(['/lists']);
      });
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
