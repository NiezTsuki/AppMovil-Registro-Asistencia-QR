import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { Asignatura, Clase } from '../models/asignaturas.model';
import { getFirestore, setDoc, doc, getDoc, collection, updateDoc, getDocs, addDoc, DocumentData, query, where } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage'
import { Asistencia } from '../models/asistencia.model';
import { Result } from '@zxing/library';
import { formatDate } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';




@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage)
  utilsSvc = inject(UtilsService)

  //--------------Autenticación---------------//

  getAuth() {
    return getAuth();
  }

  //Función Acceder//

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //Registro Usuario//

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //Actualizar Usuario//

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  //Enviar email para restablecer contraseña//
  sendRecoveryEmail(email: string) {
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
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //Subir Imagen//
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  // Nuevas funciones para Asignaturas

  getAllAsignaturas() {
    const asignaturasCollection = collection(getFirestore(), 'asignaturas');
    return getDocs(asignaturasCollection);
  }

  getAsignaturaById(asignaturaId: string) {
    const asignaturaDoc = doc(getFirestore(), `asignaturas/${asignaturaId}`);
    return getDoc(asignaturaDoc);
  }

  addAsignatura(asignatura: Asignatura) {
    const asignaturasCollection = collection(getFirestore(), 'asignaturas');
    return addDoc(asignaturasCollection, asignatura);
  }

  async getAsignatura(asignaturaId: string) {
    const asignaturaDoc = doc(getFirestore(), `asignaturas/${asignaturaId}`);
    const asignaturaSnapshot = await getDoc(asignaturaDoc);

    if (asignaturaSnapshot.exists()) {
      return { id: asignaturaSnapshot.id, ...asignaturaSnapshot.data() } as Asignatura;
    } else {
      return null;
    }
  }

  async updateAsignatura(asignaturaId: string, updatedAsignatura: Partial<Asignatura>) {
    const asignaturaDoc = doc(getFirestore(), `asignaturas/${asignaturaId}`);

    // Actualiza solo las propiedades proporcionadas en el objeto updatedAsignatura
    await updateDoc(asignaturaDoc, updatedAsignatura);
  }

  async obtenerIdAlumno(): Promise<string | null> {
    try {
      const usuarioActual = await this.auth.currentUser;

      console.log('Usuario actual:', usuarioActual);

      if (usuarioActual) {
        console.log('UID del usuario:', usuarioActual.uid);
        return usuarioActual.uid;
      } else {
        console.error('Usuario no autenticado');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el ID del alumno:', error);
      return null;
    }
  }



  async registrarAsistenciaDesdeQR(codigoQR: string): Promise<any> {
    try {
      // Dividir el código QR en partes
      const partesQR = codigoQR.split('-');

      // Verificar si hay suficientes partes
      if (partesQR.length >= 2) {
        // Obtener la información necesaria
        const fechaClase = `${partesQR[6]}-${partesQR[7]}-${partesQR[8]}`;
        const idEstudiante = await this.obtenerIdAlumno();

        // Construir el ID de la clase y el modelo de Asistencia
        const idClase = `${partesQR[0]}-${partesQR[1]}-${fechaClase}`;

        // Verificar si la fecha actual coincide con la del código QR
        const presente = formatDate(new Date(), 'yyyy-MM-dd', 'en-US', 'America/Santiago') === fechaClase;

        // Generar un ID único aleatorio
        const idUnico = uuidv4();

        const nuevaAsistencia: Asistencia = {
          id: idUnico,
          idEstudiante,
          idClase,
          fecha: fechaClase,
          presente,
        };

        // Almacenar la asistencia en Firebase
        await this.almacenarAsistenciaEnFirebase(nuevaAsistencia);

        console.log('Asistencia registrada correctamente.');

        // Devolver el objeto de asistencia
        return nuevaAsistencia;
      } else {
        console.error('Formato de código QR no válido:', codigoQR);
        return null;
      }
    } catch (error) {
      console.error('Error al procesar el código QR:', error);
      throw error;
    }
  }


  async almacenarAsistenciaEnFirebase(asistencia: Asistencia): Promise<void> {
    try {
      const db = getFirestore();
      const asistenciasCollection = collection(db, 'asistencias');

      // Añadir un nuevo documento a la colección 'asistencias'
      await addDoc(asistenciasCollection, asistencia);

      console.log('Asistencia almacenada en Firebase correctamente.');
    } catch (error) {
      console.error('Error al almacenar la asistencia en Firebase:', error);
      throw error;
    }
  }

  async obtenerAsignaturaPorId(asignaturaId: string): Promise<Asignatura | null> {
    try {
      const db = getFirestore();
      const asignaturaDoc = await getDoc(doc(db, 'asignaturas', asignaturaId));
  
      if (asignaturaDoc.exists()) {
        return { id: asignaturaDoc.id, ...asignaturaDoc.data() } as Asignatura;
      } else {
        console.error('No se encontró la asignatura con el ID proporcionado.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la asignatura:', error);
      throw error;
    }
  }
  

  async obtenerAsistenciasUsuario(): Promise<Asistencia[] | null> {
    try {
      const idEstudiante = await this.obtenerIdAlumno();
      if (!idEstudiante) {
        console.error('ID de estudiante no disponible.');
        return null;
      }

      const db = getFirestore();
      const asistenciasCollection = collection(db, 'asistencias');

      // Consultar asistencias filtrando por el ID del estudiante
      const q = query(asistenciasCollection, where('idEstudiante', '==', idEstudiante));
      const querySnapshot = await getDocs(q);

      // Mapear los documentos a objetos de tipo Asistencia
      const asistencias: Asistencia[] = [];
      querySnapshot.forEach((doc) => {
        const { id, idEstudiante, idClase, fecha, presente } = doc.data() as Asistencia;
        asistencias.push({ id, idEstudiante, idClase, fecha, presente});
      });

      return asistencias;
    } catch (error) {
      console.error('Error al obtener asistencias del usuario:', error);
      throw error;
    }
  }

  async verificarAsistenciaRegistrada(idEstudiante: string, fechaClase: string): Promise<boolean> {
    try {
      const db = getFirestore();
      const asistenciasCollection = collection(db, 'asistencias');
  
      // Consultar asistencias filtrando por el ID del estudiante, la fecha de la clase y el ID de la clase
      const q = query(asistenciasCollection, where('idEstudiante', '==', idEstudiante), where('fecha', '==', fechaClase));
      const querySnapshot = await getDocs(q);
  
      // Verificar si hay alguna asistencia registrada para el estudiante en esa clase y fecha específica
      return querySnapshot.size > 0;
    } catch (error) {
      console.error('Error al verificar asistencia registrada:', error);
      throw error;
    }
  }
  

  generateQR(asignaturaId: string, idClase: string): string {
    const fechaActual = formatDate(new Date(), 'yyyy-MM-dd', 'en-US', 'America/Santiago');
    return `${asignaturaId}-${idClase}-${fechaActual}`;
  }
  
}


