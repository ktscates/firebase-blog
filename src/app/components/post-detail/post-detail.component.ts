import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '../../services/comment/comment.service';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { BlogService } from '../../services/blog/blog.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, CommentComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent {
  post: any;
  userId: string | null = null; // Store the current user's ID

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');

    // Fetch the post by ID
    if (postId) {
      this.blogService.getPostById(postId).subscribe(
        (post) => {
          this.post = post;
          // Optionally, fetch comments for this post here
        },
        (error) => {
          console.error('Error fetching post:', error);
        }
      );
    }
  }
  // Like or unlike a post
  toggleLike(post: any): void {
    if (this.isLiked(post)) {
      this.blogService.unlikePost(post.id, this.userId!).then(() => {
        // Handle success, e.g., show a toast message
      });
    } else {
      this.blogService.likePost(post.id, this.userId!).then(() => {
        // Handle success, e.g., show a toast message
      });
    }
  }

  isLiked(post: any): boolean {
    return post.likes && post.likes.includes(this.userId); // Check if userId is in the likes array
  }
}
