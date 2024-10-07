import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { GoogleAuthProvider, User } from 'firebase/auth'; // Import from 'firebase/auth'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$!: Observable<User | null>;

  constructor(private firebaseAuth: Auth) {
    this.currentUser$ = new Observable<User | null>((observer) => {
      const unsubscribe = onAuthStateChanged(
        this.firebaseAuth,
        (user: User | null | undefined) => {
          observer.next(user);
        }
      );
      return unsubscribe;
    });
  }

  // Sign up method
  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  // Login method
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  // Login with Google
  LoginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.firebaseAuth, provider);
  }

  // Logout method
  logout() {
    return signOut(this.firebaseAuth);
  }

  // Get current user as an observable
  getCurrentUser(): Observable<User | null> {
    // Return the same currentUser$ observable
    return this.currentUser$;
  }
}
