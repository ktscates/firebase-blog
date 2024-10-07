import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog/blog.service';
import { Router } from '@angular/router';
import { Auth, User, user } from '@angular/fire/auth';
import { timeStamp } from 'console';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() showModal: boolean = false; // Toggle modal visibility
  @Input() editingPostId: string | null = null; // Post ID for editing
  @Input() title: string = ''; // For two-way binding
  @Input() content: string = ''; // For two-way binding
  @Output() close = new EventEmitter<void>(); // Close modal event

  constructor(
    private blogService: BlogService,
    private router: Router,
    private auth: Auth
  ) {}
  submitPost() {
    user(this.auth).subscribe((currentUser: User | null) => {
      if (currentUser) {
        const postData = {
          title: this.title,
          content: this.content,
          author: currentUser.displayName || currentUser.email,
          timestamp: new Date(), // Add a timestamp if needed
          likes: 0,
          likedBy: [],
        };

        if (this.editingPostId) {
          this.blogService.updatePost(this.editingPostId, postData).then(() => {
            this.resetForm();
            this.close.emit();
          });
        } else {
          this.blogService.createPost(postData).then(() => {
            this.resetForm();
            this.close.emit();
          });
        }
      }
    });
  }

  resetForm() {
    this.title = '';
    this.content = '';
    this.editingPostId = null;
  }

  closeModal() {
    this.close.emit();
  }
}
