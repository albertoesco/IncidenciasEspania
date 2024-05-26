import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { appFirebase } from './firebase/credenciales';

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

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          gestureEnabled={true}
          gestureDirection="horizontal"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#18315f',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
            headerRight: () => (
              <Image
                source={require('./assets/In.png')}
                style={styles.logo}
              />
            ),
            headerRightContainerStyle: {
              marginRight: 0,
              paddingRight: 10,
            },
          }}
        >
          <Stack.Screen 
            name="Carga" 
            component={PantallaCarga} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Comunidades" 
            component={ListComunidades} 
            options={{ headerTitle: 'Comunidades' }} 
          />
          <Stack.Screen 
            name="Provincias" 
            component={ListProvincias} 
            options={{ title: 'Provincias' }} 
          />
          <Stack.Screen 
            name="Incidencias" 
            component={ListIncidencias} 
            options={{ title: 'Incidencias' }} 
          />
          <Stack.Screen 
            name="Detail" 
            component={DetailIncidencia} 
            options={{ title: 'Detalle de la Incidencia' }} 
          />
          <Stack.Screen 
            name="New" 
            component={NewIncidencia} 
            options={{ title: 'Nueva Incidencia' }} 
          />
          <Stack.Screen 
            name="Foto" 
            component={Foto} 
            options={{ title: 'Foto' }} 
          />
          <Stack.Screen 
            name="Chat" 
            component={Chat} 
            options={{ title: 'Chat' }} 
          />
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options={{ title: 'Login' }} 
          />
          <Stack.Screen 
            name="Galeria" 
            component={Galeria} 
            options={{ title: 'Galería' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});
