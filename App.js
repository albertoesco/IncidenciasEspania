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



export default function App() {

  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Comunidades" component={ListComunidades} />
        <Stack.Screen name="Provincias" component={ListProvincias} />
        <Stack.Screen name="Incidencias" component={ListIncidencias} />
        <Stack.Screen name="Detail" component={DetailIncidencia} />
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

