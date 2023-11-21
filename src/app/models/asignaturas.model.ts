
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
    mostrarQR?: boolean; // Propiedad opcional
    detalleQR?: string; // Propiedad opcional
    idClase?: string; // Propiedad opcional
}



