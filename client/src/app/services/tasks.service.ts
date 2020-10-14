import { Injectable } from '@angular/core';
import { WebRequestsService } from './web-requests.service';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private reqService: WebRequestsService) {}

  /* ****** LISTS ****** */

  getLists = () => this.reqService.get('lists');

  createList = (title: string) => this.reqService.post('lists', { title });

  updateList = (id: string, title: string) =>
    this.reqService.patch(`lists/${id}`, { title });

  deleteList = (id: string) => this.reqService.delete(`lists/${id}`);

  /* ****** TASKS ****** */

  getTasks = (listId: string) => this.reqService.get(`lists/${listId}/tasks`);

  createTask = (title: string, listId: string) =>
    this.reqService.post(`lists/${listId}/tasks`, { title });

  updateTask = (listId: string, taskId: string, title: string) =>
    this.reqService.patch(`lists/${listId}/tasks/${taskId}`, { title });

  deleteTask = (listId: string, taskId: string) =>
    this.reqService.delete(`lists/${listId}/tasks/${taskId}`);

  completeTask = (task: Task) =>
    this.reqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed,
    });
}
