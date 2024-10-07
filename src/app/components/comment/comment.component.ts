import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentService } from '../../services/comment/comment.service';
import { Auth, User, user } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent {
  @Input() postId!: string;
  comments$!: Observable<any[]>;
  commentText: any;

  constructor(private commentService: CommentService, private auth: Auth) {}

  ngOnInit(): void {
    this.comments$ = this.commentService.getComments(this.postId);
  }

  submitComment() {
    user(this.auth).subscribe((currentUser: User | null) => {
      if (currentUser) {
        const data = {
          content: this.commentText,
          commenter: currentUser.displayName || currentUser.email,
          timestamp: new Date(),
        };

        this.commentService.addComment(this.postId, data).then(() => {
          // Navigate or show success message after comment is added
          console.log('Comment added successfully');
          this.commentText = ''; // Clear the comment input
        });
      } else {
        console.log('No user is logged in.');
      }
    });
  }
}
