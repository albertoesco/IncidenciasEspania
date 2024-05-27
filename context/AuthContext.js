import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/credenciales'; // Importa la configuración de Firebase
import { onAuthStateChanged } from 'firebase/auth'; // Importa el método para observar cambios en la autenticación

// Crea un contexto para la autenticación
const AuthContext = createContext();

// Define un proveedor de autenticación que envolverá a los componentes hijos
export const AuthProvider = ({ children }) => {
  // Define el estado para almacenar el usuario actual
  const [currentUser, setCurrentUser] = useState(null);

  // Utiliza useEffect para suscribirse a los cambios de autenticación cuando el componente se monta
  useEffect(() => {
    // Escucha cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Actualiza el estado con el usuario actual
    });

    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  // Proporciona el contexto de autenticación a los componentes hijos
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => useContext(AuthContext);
