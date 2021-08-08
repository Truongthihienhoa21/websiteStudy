import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { FalconMessageService } from 'src/app/service/falcon-message.service';

@Component({
  selector: 'app-assignment-item',
  templateUrl: './assignment-item.component.html',
  styleUrls: ['./assignment-item.component.scss'],
  providers: [FalconMessageService],
})
export class AssignmentItemComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Output() addLecture = new EventEmitter();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: FalconMessageService
  ) { }

  ngOnInit(): void { }

  get formLists() {
    return this.parentForm.get('lists_assignment') as FormArray;
  }

  getChapter(formlistItem: any) {
    return formlistItem.get('chapters').controls;
  }

  onAddLecture(sectionItem) {
    this.addLecture.emit(sectionItem);
  }

  onDeleteChapter(sectionItem, index) {
    this.confirmationService.confirm({
      message:
        'You are about to remove a curriculum item. Are you sure you want to continue?',
      header: 'Please confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.showInfo('Confirmed', 'Lecture deleted');
        sectionItem.get('chapters').removeAt(index);
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.showError('Rejected', 'You have rejected');
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.showWarning('Cancelled', 'You have cancelled');
            break;
        }
      },
    });
  }

  onDeleteSection(index) {
    this.confirmationService.confirm({
      message:
        'Bạn có muốn có bài tập này không?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.showInfo('Confirmed', 'Section deleted');
        this.formLists.removeAt(index);
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.showError('Rejected', 'You have rejected');
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.showWarning('Cancelled', 'You have cancelled');
            break;
        }
      },
    });
  }
}
