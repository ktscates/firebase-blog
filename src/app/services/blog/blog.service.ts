import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private firestore: Firestore) {}

  // Create a new post
  createPost(data: any): Promise<any> {
    const postsRef = collection(this.firestore, 'posts');
    return addDoc(postsRef, data);
  }

  // Get all posts
  getPosts(): Observable<any[]> {
    const postsRef = collection(this.firestore, 'posts');
    return collectionData(postsRef, { idField: 'id' }).pipe(
      map((posts: any[]) =>
        posts.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate())
      )
    );
  }

  getPostById(id: string): Observable<any> {
    const postDocRef = doc(this.firestore, `posts/${id}`);
    return new Observable((observer) => {
      // Fetch the document data
      getDoc(postDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            // Emit the post data
            observer.next({ id: docSnapshot.id, ...docSnapshot.data() });
            observer.complete(); // Complete the observable
          } else {
            observer.error('Post does not exist'); // Emit an error if post does not exist
          }
        })
        .catch((error) => {
          observer.error(error); // Emit any errors that occur during fetching
        });
    });
  }

  // Edit a post
  updatePost(id: string, data: any): Promise<void> {
    const postDocRef = doc(this.firestore, `posts/${id}`);
    return updateDoc(postDocRef, data);
  }

  // Delete a post
  deletePost(id: string): Promise<void> {
    const postDocRef = doc(this.firestore, `posts/${id}`);
    return deleteDoc(postDocRef);
  }

  // Like a post
  likePost(postId: string, userId: string): Promise<void> {
    const postDocRef = doc(this.firestore, `posts/${postId}`);
    return updateDoc(postDocRef, {
      likes: arrayUnion(userId), // Use arrayUnion directly
    });
  }

  // Unlike a post
  unlikePost(postId: string, userId: string): Promise<void> {
    const postDocRef = doc(this.firestore, `posts/${postId}`);
    return updateDoc(postDocRef, {
      likes: arrayRemove(userId), // Use arrayRemove directly
    });
  }
}
