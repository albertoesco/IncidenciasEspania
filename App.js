import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { appFirebase } from './firebase/credenciales';

// Importar los componentes
import ListComunidades from './screens/ListComunidades';
import ListProvincias from './screens/ListProvincias';
import ListIncidencias from './screens/ListIncidencias';
import DetailIncidencia from './screens/DetailIncidencia';
import NewIncidencia from './screens/NewIncidencia';
import Foto from './screens/Foto';
import Chat from './screens/Chat';
import Login from './screens/Login';
import Galeria from './screens/Galeria';
import PantallaCarga from './screens/PantallaCarga';

import { AuthProvider } from './context/AuthContext';

export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator
        gestureEnabled={true} // Habilitar los gestos de navegación
        gestureDirection="horizontal" // Configurar la dirección del gesto
        screenOptions={{
          headerStyle: {
            backgroundColor: '#18315f', // Color de fondo del header (azul oscuro)
            elevation: 0, // Quitar sombra en Android
            shadowOpacity: 0, // Quitar sombra en iOS
          },
          headerTintColor: '#fff', // Color del texto e íconos del header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center', // Centrar el título en el header
          headerRight: () => (
            <Image
              source={require('./assets/splash.png')} // Ruta de la imagen del logo
              style={styles.logo}
            />
          ),
          headerRightContainerStyle: {
            marginRight: 10, // Ajustar el margen derecho del logo
          },
        }}
      >
        <Stack.Screen 
          name="Carga" 
          component={PantallaCarga} 
          options={{ headerShown: false }} // Ocultar el header en la pantalla de carga
        />
        <Stack.Screen 
          name="Comunidades" 
          component={ListComunidades} 
          options={{ headerTitle: 'Comunidades' }} // Personalizar el título del header
        />
        <Stack.Screen 
          name="Provincias" 
          component={ListProvincias} 
          options={{ title: 'Provincias' }} // Personalizar el título del header
        />
        <Stack.Screen 
          name="Incidencias" 
          component={ListIncidencias} 
          options={{ title: 'Incidencias' }} // Personalizar el título del header
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailIncidencia} 
          options={{ title: 'Detalle de la Incidencia' }} // Personalizar el título del header
        />
        <Stack.Screen 
          name="New" 
          component={NewIncidencia} 
          options={{ title: 'Nueva Incidencia' }} // Personalizar el título del header
        />
        <Stack.Screen 
          name="Foto" 
          component={Foto} 
          options={{ title: 'Foto' }} // Personalizar el título del header
        />
        <Stack.Screen 
          name="Chat" 
          component={Chat} 
          options={{ title: 'Chat' }} // Personalizar el título del header
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Login' }} // Personalizar el título del header
        />
        <Stack.Screen 
          name="Galeria" 
          component={Galeria} 
          options={{ title: 'Galería' }} // Personalizar el título del header
        />
      </Stack.Navigator>
    )
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 120, // Ancho deseado del logo
    height: 40, // Alto deseado del logo
    resizeMode: 'contain', // Ajuste de la imagen
  },
});
