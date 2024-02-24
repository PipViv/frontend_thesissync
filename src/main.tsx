import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from './routes/Signup.tsx';
import Dashboard from './app/dashboard/Dashboard.tsx';
import Login from './routes/Login.tsx';
import Profile from './app/users/UserPanel.tsx'
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThesisForm from './routes/ThesisForm.tsx';
import TeacherPanel from './app/Teacher/TeacherPanel.tsx';
import SignupDo from './app/Teacher/SignupDo.tsx';
import UserPanel from './app/users/UserPanel.tsx';
//import './assets/css/index.css'

//Rutas
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/estudiante/signup",
    element: <Signup />,
  },
  {
    path: "/docente/signup",
    element: <SignupDo />,
  },
  {
    path: "/subirThesis",
    element: <ThesisForm />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [

      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/userProfile",
        element: <Profile />,
      },
      {
        path: "/documentos/evaluar",
        element: <TeacherPanel />,
      }

    ]
  },

])





ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
