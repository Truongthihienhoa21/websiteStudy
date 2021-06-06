import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { FalconMessageService } from 'src/app/service/falcon-message.service';

@Component({
  selector: 'app-curriculum-item',
  templateUrl: './curriculum-item.component.html',
  styleUrls: ['./curriculum-item.component.scss'],
  providers: [FalconMessageService],
})
export class CurriculumItemComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Output() addSection = new EventEmitter();
  @Output() addLecture = new EventEmitter();

  isEditSection = false;
  currentIndexSection: number = 0;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: FalconMessageService
  ) {}

  ngOnInit(): void {}

  get formLists() {
    return this.parentForm.get('section') as FormArray;
  }

  getChapter(formSectionItem: any) {
    return formSectionItem.get('chapter').controls;
  }

  getTitleChapter(formItem: FormControl) {
    return formItem.get('title').value;
  }

  getDescriptionChapter(formItem: FormControl) {
    return formItem.get('description').value;
  }

  getVideoUrlChapter(formItem: FormControl) {
    return formItem.get('videoUrl').value;
  }

  onDelete(index) {
    this.formLists.removeAt(index);
  }

  onAddLecture(sectionItem) {
    this.addLecture.emit(sectionItem);
  }

  onEditSection(index) {
    this.isEditSection = true;
    this.currentIndexSection = index;
  }

  onDeleteSection(index) {
    this.confirmationService.confirm({
      message:
        'You are about to remove a curriculum item. Are you sure you want to continue?',
      header: 'Please confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.showSuccess('Confirmed', 'Section deleted');
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

  onDeleteChapter(sectionItem, index) {
    this.confirmationService.confirm({
      message:
        'You are about to remove a curriculum item. Are you sure you want to continue?',
      header: 'Please confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.showSuccess('Confirmed', 'Lecture deleted');
        sectionItem.get('chapter').removeAt(index);
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
