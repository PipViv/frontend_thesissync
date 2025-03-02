/*export interface AuthResponse{
    data:{
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}*/

export interface AuthResponse {
    body: {
        //user: UserInfo
        accessToken: string;
        refreshToken: string;
        id:number;
        rol:number;
    };
}

export interface AuthResponseError {
    data: {
        error: string;
    }
}

export interface UserResponse {
    data: UserInfo[];
    program: { id: number, student: string, programd: number, nombre:string };
    userRol: { id: number, userd: string, rol: number };
}

export interface UserInfo {
    id: number;
    cedula: string;
    nombre: string;
    apellido: string;
    celular: string;
    telefono?: string; // Agregué el signo de interrogación para indicar que este campo es opcional
    correoInsti?: string; // Agregué el signo de interrogación para indicar que este campo es opcional
    correoAlter?: string; // Agregué el signo de interrogación para indicar que este campo es opcional
    direccion?: string; // Agregué el signo de interrogación para indicar que este campo es opcional
    photo: File;
    carrera: number;
}


export interface Role {
    id: number;
}

export interface AccessTokenResponse {
    statusCode: number,
    body: {
        accessToken: string;
    };
    error?: string;
}


export interface ProfileInfo {
    userInfo: number;
    rol: number;
}


export interface Thesis {
    document_id: number;
    user_id_public: number;
    public_nombre:string;
    a_nombre:string;
    b_nombre:string;
    tutor_nombre:string;
    jurado_nombre:string;
    user_id_a: number;
    user_id_b: number;
    user_id_tutor: number;
    user_id_jurado: number;
    comentario: string;
    title: string;
    fecha_creacion: Date;
    document: {
        type: string;
        data: number[];
    };
    extension: string;
    calificacion: number;
}


export interface User {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    correo: string;
    programas:{
      [x: string]: any;id:number, nombre:string
}
}

export interface Teacher {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    correo: string;
}

export interface JuradoResponse{
    id:number;
    idUser:number;
    name:string;
}
//const formattedDate = moment("2024-05-05T05:00:00.000Z").format("YYYY-MM-DD");



