import { Component, Input, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogService } from '../../services/blog/blog.service';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { Auth, User, user } from '@angular/fire/auth';
import { MetaService } from '../../services/meta/meta.service';
import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
} from '@angular/fire/analytics';
import { initializeApp } from '@angular/fire/app';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list-post',
  standalone: true,
  imports: [
    CommonModule,
    CommentComponent,
    FormsModule,
    ModalComponent,
    NavbarComponent,
  ],
  templateUrl: './list-post.component.html',
  styleUrl: './list-post.component.css',
})
export class ListPostComponent {
  posts$!: Observable<any[]>;
  @Input() isModalOpen: boolean = false; // Input from parent to control modal visibility
  @Input() editingPost: any = null; // Hold the post being edited
  title: string = ''; // Title for creating/editing posts
  content: string = ''; // Content for creating/editing posts
  editingPostId: string | null = null; // Post ID for editing
  userId: string | null = null; // Current user ID

  constructor(
    private blogService: BlogService,
    private router: Router,
    private auth: Auth,
    private metaService: MetaService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.posts$ = this.blogService.getPosts();
    // Get current user ID
    user(this.auth).subscribe((currentUser: User | null) => {
      this.userId = currentUser?.uid || null;
    });
  }

  goToPostDetails(postId: string): void {
    this.router.navigate([`/posts/${postId}`]).then(() => {
      this.blogService.getPostById(postId).subscribe((post) => {
        this.metaService.updateMetaTags(
          post.title,
          post.content,
          'ktscates blog post'
        );
        this.injectStructuredData(post);
        // Track page view with Firebase Analytics
        if (typeof window !== 'undefined') {
          logEvent(getAnalytics(), 'page_view', {
            page_title: `Post: ${postId}`,
            page_location: window.location.href,
            page_path: `/posts/${postId}`,
          });
        }
      });
    });
  }

  // Open modal for creating a new post
  openCreateModal() {
    this.isModalOpen = true;
    this.editingPost = null; // Reset editing post
    this.title = ''; // Clear title for create mode
    this.content = ''; // Clear content for create mode
    this.editingPostId = null; // Reset editingPostId
  }

  // Open modal for editing an existing post
  editPost(post: any) {
    this.isModalOpen = true;
    this.editingPost = post; // Set post to edit
    this.title = post.title; // Set title for edit mode
    this.content = post.content; // Set content for edit mode
    this.editingPostId = post.id; // Set post ID for edit mode
  }

  // Close modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Delete a post
  deletePost(postId: string) {
    this.blogService.deletePost(postId);
  }

  injectStructuredData(post: any): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.content,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      datePublished: post.timestamp?.toDate(),
    };

    // Create a script element for JSON-LD
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);

    // Remove existing JSON-LD script if exists
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingScript) {
      this.renderer.removeChild(document.head, existingScript);
    }

    // Inject the new script into the head
    this.renderer.appendChild(document.head, script);
  }
}
