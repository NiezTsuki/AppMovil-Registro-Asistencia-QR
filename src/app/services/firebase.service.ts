import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth';
import { User} from '../models/user.model';
import { Asignatura, Clase} from '../models/asignaturas.model';
import { getFirestore, setDoc, doc, getDoc, collection, updateDoc, getDocs, addDoc} from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL} from 'firebase/storage'
import { Asistencia } from '../models/asistencia.model';
import { Result } from '@zxing/library';




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


  async marcarAsistenciaEnClase(idAsignatura: string, idClase: string, idAlumno: string): Promise<void>  {
    try {
      const asignaturaSnapshot = await this.getAsignaturaById(idAsignatura);

      if (asignaturaSnapshot.exists()) {
        const asignaturaData = asignaturaSnapshot.data();
        const clases: Clase[] = asignaturaData['clases'] || [];

        const clase = clases.find((c) => c.id === idClase);

        if (clase) {
          // Verificar si el alumno ya está en la lista (para evitar duplicados)
          if (!clase.asistentes || clase.asistentes.indexOf(idAlumno) === -1) {
            clase.asistentes = clase.asistentes || [];
            clase.asistentes.push(idAlumno);

            // Actualizar la asignatura en la base de datos
            await this.updateDocument(`asignaturas/${idAsignatura}`, { clases });
            console.log('Asistencia registrada correctamente.');
          } else {
            console.log('El alumno ya está marcado como presente en esta clase.');
          }
        } else {
          console.error('Clase no encontrada en la asignatura.');
        }
      } else {
        console.error('Asignatura no encontrada.');
      }
    } catch (error) {
      console.error('Error al marcar la asistencia en la clase:', error);
    }
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

      if (usuarioActual) {
        return usuarioActual.uid;
      } else {
        // Puedes manejar el caso en el que no haya usuario autenticado, por ejemplo, redirigiendo a la página de inicio de sesión.
        console.error('Usuario no autenticado');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el ID del alumno:', error);
      return null;
    }
  }

  // Obtener información del alumno por ID
  async obtenerInformacionAlumnoPorId(idAlumno: string): Promise<any> {
    try {
      // Puedes ajustar la ruta a tus datos de alumno en Firestore
      const alumnoDoc = doc(getFirestore(), `alumnos/${idAlumno}`);
      const alumnoSnapshot = await getDoc(alumnoDoc);

      if (alumnoSnapshot.exists()) {
        // Devuelve los datos del alumno si existe
        return alumnoSnapshot.data();
      } else {
        console.error('Alumno no encontrado.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener información del alumno:', error);
      throw error;
    }
  }

  async registrarAsistenciaDesdeQR(codigoQR: string): Promise<any> {
    try {
      // Parsea el código QR para obtener la información necesaria (ajusta según tu estructura)
      const infoQR = JSON.parse(codigoQR);

      // Asegúrate de que la información en el código QR contenga el idAsignatura
      const idAsignatura = infoQR.idAsignatura; // Ajusta según la estructura real del código QR
      const idClase = infoQR.idClase;
      const idAlumno = await this.obtenerIdAlumno();

      // Verificar si el alumno ya está marcado como presente
      const asistenciaRegistrada = await this.verificarAsistenciaRegistrada(idAsignatura, idClase, idAlumno);

      if (!asistenciaRegistrada) {
        // Obtén la asignatura y marca la asistencia
        const asignatura = await this.getAsignatura(idAsignatura);

        if (asignatura) {
          const clases: any[] = asignatura.clases || [];
          const clase = clases.find((c) => c.id === idClase);

          if (clase) {
            // Verificar si el alumno ya está en la lista (para evitar duplicados)
            if (!clase.asistentes || clase.asistentes.indexOf(idAlumno) === -1) {
              clase.asistentes = clase.asistentes || [];
              clase.asistentes.push(idAlumno);

              // Actualizar la asignatura en la base de datos
              await this.updateDocument(`asignaturas/${idAsignatura}`, { clases });
              console.log('Asistencia registrada correctamente.');

              // Obtén la información del estudiante y devuélvela
              const infoEstudiante = await this.obtenerInformacionAlumnoPorId(idAlumno);
              return infoEstudiante;
            } else {
              console.log('El alumno ya está marcado como presente en esta clase.');
              return null;
            }
          } else {
            console.error('Clase no encontrada en la asignatura.');
            return null;
          }
        } else {
          console.error('Asignatura no encontrada.');
          return null;
        }
      } else {
        console.log('El alumno ya tiene registrada la asistencia en esta clase.');
        return null;
      }
    } catch (error) {
      console.error('Error al procesar el código QR:', error);
      throw error;
    }
  }

  // Resto del código...

  // Función para verificar si la asistencia ya está registrada
  async verificarAsistenciaRegistrada(idAsignatura: string, idClase: string, idAlumno: string): Promise<boolean> {
    try {
      const asignatura = await this.getAsignatura(idAsignatura);

      if (asignatura) {
        const clases: any[] = asignatura.clases || [];
        const clase = clases.find((c) => c.id === idClase);

        if (clase) {
          return clase.asistentes && clase.asistentes.indexOf(idAlumno) !== -1;
        } else {
          console.error('Clase no encontrada en la asignatura.');
          return false;
        }
      } else {
        console.error('Asignatura no encontrada.');
        return false;
      }
    } catch (error) {
      console.error('Error al verificar la asistencia registrada:', error);
      return false;
    }
  }

}
