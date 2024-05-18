import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Importar los componentes
import ListComunidades from './screens/ListComunidades';
import ListProvincias from './screens/ListProvincias';
import ListIncidencias from './screens/ListIncidencias';
import DetailIncidencia from './screens/DetailIncidencia';
import NewIncidencia from './screens/NewIncidencia';
import Foto from './screens/Foto';
import Chat from './screens/Chat';
import Login from './screens/Login';

export default function App() {

  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator
        gestureEnabled={true} // Habilitar los gestos de navegación
        gestureDirection="horizontal" // Configurar la dirección del gesto
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ad1519', // Color de fondo del header
          },
          headerTintColor: '#fff', // Color del texto e íconos del header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Comunidades" component={ListComunidades} />
        <Stack.Screen name="Provincias" component={ListProvincias} />
        <Stack.Screen name="Incidencias" component={ListIncidencias} />
        <Stack.Screen name="Detail" component={DetailIncidencia} />
        <Stack.Screen name="New" component={NewIncidencia} />
        <Stack.Screen name="Foto" component={Foto} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
