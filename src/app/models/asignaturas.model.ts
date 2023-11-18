
export interface Clase {
    id: string; 
    fecha: string;
    asistentes?: string[];
}

export interface Asignatura {
    id: string;
    nombre: string;
    imagenUrl: string;
    clases: Clase[];
    mostrarDetalleQR?: boolean; // Agrega esta propiedad opcional
    detalleQR?: string; // Agrega esta propiedad opcional
}

