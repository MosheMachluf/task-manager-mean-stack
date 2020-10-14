import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  taskId: string;
  listId: string;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.taskId = params.taskId;
      this.listId = params.listId;
    });
  }

  onUpdateTask(title: string) {
    this.tasksService
      .updateTask(this.listId, this.taskId, title)
      .subscribe(() => {
        this.router.navigate([`/lists/${this.listId}`]);
      });
  }
}
