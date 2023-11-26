export interface AuthResponse{
    body:{
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}
export interface AuthResponseError{
    body:{
        error:string;
    }
}
export interface User {
    id: any;
    rol: number;
    _id: string;
    name:string;
    username: string;
}

export interface AccessTokenResponse{
    statusCOnde: number,
    body:{
        accessToken: string;
    };
    error?:string;
}