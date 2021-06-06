import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class FalconMessageService {
  constructor(private messageService: MessageService) {}

  showSuccess(title: string, description: string) {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: description,
    });
  }

  showError(title: string, description: string) {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: description,
    });
  }

  showInfo(title: string, description: string) {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: description,
    });
  }

  showWarning(title: string, description: string) {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: description,
    });
  }
}
