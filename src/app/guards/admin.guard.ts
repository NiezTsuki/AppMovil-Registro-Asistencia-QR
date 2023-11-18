// duoc.guard.ts
import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DuocGuard implements CanActivate {

  constructor(
    @Inject(FirebaseService) private firebaseSvc: FirebaseService,
    @Inject(UtilsService) private utilsSvc: UtilsService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    const auth = getAuth();

    return new Observable<boolean>((observer) => {
      const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
        if (user && user.email?.endsWith('@duocuc.cl')) {
          observer.next(true);
        } else {
          this.router.navigate(['main/home']); // Redirigir a una página de acceso denegado
          observer.next(false);
        }
        observer.complete();
      });

      return () => unsubscribe();
    });
  }
}


