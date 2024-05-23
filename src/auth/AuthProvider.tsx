import React, { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, AccessTokenResponse, User } from "../types/types";
import { API_URL } from '../constants/constants';
import { jwtDecode } from 'jwt-decode';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean;
  getAccessToken: () => string;
  saveUser: (userData: AuthResponse) => void;
  getRefreshToken: () => string | null;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  getAccessToken: () => "",
  saveUser: (userData: AuthResponse) => { },
  getRefreshToken: () => null,
  signout: () => { },
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth().finally(() => setIsLoading(false));
  }, []);

  function isTokenValid(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  async function requestNewAccessToken(refreshToken: string) {
    try {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json() as AccessTokenResponse;
        if (json.error) {
          throw new Error(json.error);
        }
        return json.body.accessToken;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log("Error al solicitar un nuevo access token:", error);
      return null;
    }
  }

  async function getUserInfo(accessToken: string) {
    console.log("access token ", accessToken)
    try {
      const response = await fetch(`${API_URL}/user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // Utilizar accessToken en lugar de refreshToken
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }
        return json.body;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  async function checkAuth() {
    try {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = getRefreshToken();
      if (storedAccessToken && isTokenValid(storedAccessToken)) {
        const userInfo = await getUserInfo(storedRefreshToken);
        if (userInfo) {
          saveSessionInfo(userInfo, storedAccessToken, storedRefreshToken!);
          setIsAuthenticated(true);
        } else {
          handleUnauthorized();
        }
      } else if (storedRefreshToken) {
        const newAccessToken = await requestNewAccessToken(storedRefreshToken);
        if (newAccessToken) {
          const userInfo = await getUserInfo(newAccessToken);
          if (userInfo) {
            saveSessionInfo(userInfo, newAccessToken, storedRefreshToken);
            setIsAuthenticated(true);
          } else {
            handleUnauthorized();
          }
        } else {
          handleUnauthorized();
        }
      } else {
        handleUnauthorized();
      }
    } catch (error) {
      console.log("Error al verificar la autenticación:", error);
      handleUnauthorized();
    }
  }

  function handleUnauthorized() {
    setIsAuthenticated(false);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setIsLoading(false);
  }

  function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(userInfo);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("accessToken", accessToken);
    setIsAuthenticated(true);
  }

  function getAccessToken() {
    return accessToken || localStorage.getItem("accessToken") || "";
  }

  function getRefreshToken(): string | null {
    return refreshToken || localStorage.getItem("refreshToken");
  }

  function saveUser(userData: AuthResponse) {
    const { id, rol, accessToken, refreshToken } = userData.body;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser({ id, rol });
    setIsAuthenticated(true);
  }

  function signout() {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setAccessToken("");
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);




/*import React, { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, AccessTokenResponse, User } from "../types/types";
import { API_URL } from '../constants/constants';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean;
  getAccessToken: () => string;
  saveUser: (userData: AuthResponse) => void;
  getRefreshToken: () => string | null;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  getAccessToken: () => "",
  saveUser: (userData: AuthResponse) => {},
  getRefreshToken: () => null,
  signout: () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth().finally(() => setIsLoading(false));
  }, []);

  async function requestNewAccessToken(refreshToken: string) {
    try {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json() as AccessTokenResponse;
        if (json.error) {
          throw new Error(json.error);
        }
        return json.body.accessToken;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log("Error al solicitar un nuevo access token:", error);
      return null;
    }
  }

  async function getUserInfo(accessToken: string) {
    try {
      const response = await fetch(`${API_URL}/user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }
        return json.body;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function checkAuth() {
    try {
      const storedRefreshToken = getRefreshToken();
      if (storedRefreshToken) {
        const newAccessToken = await requestNewAccessToken(storedRefreshToken);
        if (newAccessToken) {
          const userInfo = await getUserInfo(newAccessToken);
          if (userInfo) {
            saveSessionInfo(userInfo, newAccessToken, storedRefreshToken);
            setIsAuthenticated(true); // Inicia sesión automáticamente
          } else {
            handleUnauthorized();
          }
        } else {
          handleUnauthorized();
        }
      } else {
        handleUnauthorized();
      }
    } catch (error) {
      console.log("Error al verificar la autenticación:", error);
      handleUnauthorized();
    }
  }

  function handleUnauthorized() {
    setIsAuthenticated(false);
    localStorage.removeItem("refreshToken");
    setIsLoading(false);
  }

  function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(userInfo);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("accessToken", accessToken);
    setIsAuthenticated(true);
  }

  function getAccessToken() {
    return accessToken || localStorage.getItem("accessToken") || "";
  }

  function getRefreshToken(): string | null {
    return refreshToken || localStorage.getItem("refreshToken");
  }

  function saveUser(userData: AuthResponse) {
    const { id, rol, accessToken, refreshToken } = userData.body;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser({ id, rol });
    setIsAuthenticated(true);
  }

  function signout() {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setAccessToken("");
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);*/
/*import React, { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, AccessTokenResponse, User } from "../types/types";
import { API_URL } from '../constants/constants';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean;
  getAccessToken: () => string;
  saveUser: (userData: AuthResponse) => void;
  getRefreshToken: () => string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  getAccessToken: () => "",
  saveUser: (userData: AuthResponse) => { },
  getRefreshToken: () => null,
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  async function requestNewAccessToken(refreshToken: string) {
    try {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json() as AccessTokenResponse;
        if (json.error) {
          throw new Error(json.error);
        }
        return json.body.accessToken;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getUserInfo(accessToken: string) {
    try {
      const response = await fetch(`${API_URL}/user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }
        return json;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async function checkAuth() {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        const newAccessToken = await requestNewAccessToken(refreshToken);
        if (newAccessToken) {
          const userInfo = await getUserInfo(newAccessToken);
          if (userInfo) {
            saveSessionInfo(userInfo, newAccessToken, refreshToken);
          } else {
            // Usuario no encontrado, manejar este caso
            handleUnauthorized();
          }
        } else {
          // No se pudo obtener un nuevo access token, manejar este caso
          handleUnauthorized();
        }
      } else {
        // No hay refresh token, manejar este caso
        handleUnauthorized();
      }
    } catch (error) {
      console.log("Error al verificar la autenticación:", error);
      handleUnauthorized();
    }
  }

  function handleUnauthorized() {
    setIsAuthenticated(false);
    localStorage.removeItem("refreshToken");
  }
  /*
  async function checkAuth() {
    const token = getRefreshToken();
    if (token) {
      const newAccessToken = await requestNewAccessToken(token);
      if (newAccessToken) {
        const userInfo = await getUserInfo(newAccessToken);
        if (userInfo) {
          saveSessionInfo(userInfo, newAccessToken, token);
        }
      }
    }
  }*/
/*
function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string) {
  setAccessToken(accessToken);
  setUser(userInfo);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("accessToken", accessToken);
  setIsAuthenticated(true);
}
 
function getAccessToken() {
  return accessToken || localStorage.getItem("accessToken") || "";
}
 
function getRefreshToken(): string | null {
  return refreshToken || localStorage.getItem("refreshToken");
}

/*
function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string) {
  setAccessToken(accessToken);
  setUser(userInfo);
  localStorage.setItem("refreshToken", refreshToken);
  setIsAuthenticated(true);
}

function getAccessToken() {
  return accessToken;
}

function getRefreshToken(): string | null {
  return localStorage.getItem("refreshToken");
}*/
/*
  function saveUser(userData: AuthResponse) {
    const { id, rol, accessToken, refreshToken } = userData.body;
    // Guardar los datos del usuario como desees
    console.log("ID del usuario:", id);
    console.log("ROL del usuario:", rol);
    console.log("ACCESSTOKEN del usuario:", accessToken);
    console.log("REFRESHTOKEN del usuario:", refreshToken);
    // Si deseas almacenar los datos del usuario en el estado, puedes hacerlo así:
    // setUser({ id, rol, accessToken, refreshToken });
    // También puedes guardar el token de acceso en el almacenamiento local si lo necesitas
    localStorage.setItem("accessToken", accessToken);
    // Actualizar el estado de autenticación
    setIsAuthenticated(true);
  }

  useEffect(() => {
    checkAuth().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (

    <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

{/*<AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken }}>
      {children}
    </AuthContext.Provider>*/ /*}

export const useAuth = () => useContext(AuthContext);
*/

/*
import React, { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, AccessTokenResponse, User } from "../types/types";
import { API_URL } from '../constants/constants';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => "",
  saveUser: (userData: AuthResponse) => {},
  getRefreshToken: () => null,
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function requestNewAccessToken(refreshToken: string) {
    try {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json() as AccessTokenResponse;
        if (json.error) {
          throw new Error(json.error);
        }
        return json.body.accessToken;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getUserInfo(accessToken: string) {
    try {
      const response = await fetch(`${API_URL}/user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }
        return json;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function checkAuth() {
    const token = getRefreshToken();
    if (token) {
      const newAccessToken = await requestNewAccessToken(token);
      if (newAccessToken) {
        const userInfo = await getUserInfo(newAccessToken);
        if (userInfo) {
          saveSessionInfo(userInfo, newAccessToken, token);
        }
      }
    }
  }

  function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string) {
    setAccessToken(accessToken);
    setUser(userInfo);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
  }

  function getAccessToken() {
    return accessToken;
  }

  function getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  function saveUser(userData: AuthResponse) {
    saveSessionInfo(userData.body.user, userData.body.accessToken, userData.body.refreshToken);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

*/
/*import React, { useContext, createContext, useState, useEffect } from "react";
//import { AuthResponse } from "../types/types";
import type { AuthResponse, AccessTokenResponse, User } from "../types/types";
import { API_URL } from '../constants/constants';

interface AuthProviderProps {
    children: React.ReactNode;

}
const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => { },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    saveUser: (userData: AuthResponse) => { },
    getRefreshToken: () => { }
})

export function AuthProvider({ children }: AuthProviderProps) {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string>("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, setUser] = useState<User>();
    //const [refreshToken, setRefreshToken] = useState<string>("");

    useEffect(() => { checkAuth();}, []);

    async function requestNewAccessToken(refreshToken: string) {
        try {
            const response = await fetch(`${API_URL}/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${refreshToken}`,
                },
            });

            if (response.ok) {
                const json = await response.json() as AccessTokenResponse;
                if (json.error) {
                    throw new Error(json.error);
                }
                return json.body.accessToken;
            } else {
                throw new Error(response.statusText);

            }
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    async function getUserInfo(accessToken: string) {
        try {
            const response = await fetch(`${API_URL}/user/info`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                if (json.error) {
                    throw new Error(json.error);
                }
                return json;
            } else {
                throw new Error(response.statusText);

            }
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    async function checkAuth() {
        if (accessToken) { console.log()} else {
            const token = getRefreshToken();
            if (token) {
                const newAccessToken = await requestNewAccessToken(token);
                if (newAccessToken) {
                    const userInfo = await getUserInfo(newAccessToken)
                    if (userInfo) {
                        saveSessionInfo(userInfo, newAccessToken, token)
                    }
                }
            }
        }
    }

    function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string) {
        setAccessToken(accessToken);
        setUser(userInfo)
        localStorage.setItem("token", JSON.stringify(refreshToken));
        setIsAuthenticated(true);
    }

    function getAccessToken() {
        return accessToken;
    }

    function getRefreshToken(): string | null {
        const tokenData = localStorage.getItem("token");
        if (tokenData) {
            const { token } = JSON.parse(tokenData)
            return token
        }
        return null;
    }

    function saveUser(userData: AuthResponse) {
        saveSessionInfo(userData.body.user, userData.body.accessToken, userData.body.refreshToken)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken }}>
            {children}
        </AuthContext.Provider>);

}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);*/