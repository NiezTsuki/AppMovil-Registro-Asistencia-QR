import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth';
import { User } from '../models/user.model';
import { getFirestore, setDoc, doc, getDoc, collection, updateDoc} from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL} from 'firebase/storage'




@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage)
  utilsSvc = inject(UtilsService)

  //--------------Autenticación---------------//

  getAuth(){
    return getAuth();
  }

  //Función Acceder//

  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //Registro Usuario//

  signUp(user: User){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //Actualizar Usuario//

  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser,{displayName})
  }

  //Enviar email para restablecer contraseña//
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }

  //------------Base de datos------------//
  
  //setear documento//
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //Actualizar documento//
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //Cerrar Sesion//
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  //Obtener documento//
  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //Subir Imagen//
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path),data_url,'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }
  

}
