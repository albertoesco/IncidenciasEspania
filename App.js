import * as React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
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

import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createStackNavigator();

function AppStack() {
  const { currentUser } = useAuth();

  return (
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
        headerLeft: () => (
          currentUser && (
            <View style={styles.headerLeft}>
              <Text style={styles.userName}>
                {currentUser.email.split('@')[0]}
              </Text>
            </View>
          )
        ),
        headerLeftContainerStyle: {
          marginLeft: 10,
        },
        headerRight: () => (
          <Image
            source={require('./assets/In.png')}
            style={styles.logo}
          />
        ),
        headerRightContainerStyle: {
          marginRight: 10,
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
        options={{ title: 'Detalle Incidencia' }} 
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
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppStack />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
