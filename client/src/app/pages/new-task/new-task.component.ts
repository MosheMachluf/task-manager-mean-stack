import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { title } from 'process';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/interfaces/task';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent implements OnInit {
  listId: string;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId'];
    });
  }

  createNewTask(title: string) {

    this.tasksService
      .createTask(title, this.listId)
      .subscribe((newTask: Task) => {
        this.toastr.info('New Task!', newTask.title);
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }
}
