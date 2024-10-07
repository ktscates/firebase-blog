import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  collectionData,
} from '@angular/fire/firestore';
import { query } from 'firebase/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private firestore: Firestore) {}

  // Add a new comment to a post
  addComment(postId: string, data: any): Promise<any> {
    const commentsRef = collection(this.firestore, `posts/${postId}/comments`); // Get the reference to the comments collection
    return addDoc(commentsRef, data); // Add a new document (comment) to the collection
  }

  // Get all comments for a specific post
  getComments(postId: string): Observable<any[]> {
    const commentsRef = collection(this.firestore, `posts/${postId}/comments`); // Get the reference to the comments collection
    const commentsQuery = query(commentsRef, orderBy('timestamp', 'desc')); // Query to order comments by timestamp

    return collectionData(commentsQuery, { idField: 'id' }).pipe(
      map((comments: any[]) => comments) // Map the results to include the comment IDs
    );
  }
}
