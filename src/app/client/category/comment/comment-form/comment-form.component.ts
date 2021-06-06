import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../../../../model/model';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {
  @Output() commentSubmit = new EventEmitter<Comment>();
  commentForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.commentForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      html: [''],
    });
  }

  submitComment() {
    const newComment: Comment = this.commentForm.value;

    newComment.like = 0;
    newComment.reply = 0;

    this.commentSubmit.emit(newComment);
    this.commentForm.reset();
  }
}
