import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import appFirebase from '../firebase/credenciales';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

export default function ListComunidades(props) {
  const [lista, setLista] = useState([]);
  const [imagenes, setImagenes] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(false); // Estado para saber si el usuario está registrado

  useEffect(() => {
    const getLista = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'comunidades'));
        const docs = [];
        querySnapshot.forEach((doc) => {
          const { nombre, idcomunidad } = doc.data();
          docs.push({
            idcomunidad,
            nombre,
          });
        });
        setLista(docs);
      } catch (error) {
        console.log(error);
      }
    };
    getLista();
  }, []);

  useEffect(() => {
    const obtenerImagenes = async () => {
      const imagenes = {};
      for (const comunidad of lista) {
        const imagePath = `comunidades/${comunidad.nombre}/${comunidad.nombre}.jpg`; // Ruta de la imagen en el almacenamiento
        try {
          const url = await getDownloadURL(ref(storage, imagePath)); // Obtiene la URL de descarga de la imagen
          imagenes[comunidad.idcomunidad] = url;
        } catch (error) {
          console.error(`Error al obtener la imagen de ${comunidad.nombre}:`, error);
        }
      }
      setImagenes(imagenes);
    };
    obtenerImagenes();
  }, [lista]);

  // Función para manejar el inicio de sesión o cierre de sesión
  const handleLogin = () => {
    if (userLoggedIn) {
      // Cerrar sesión
      // Aquí deberías agregar la lógica para cerrar sesión
    } else {
      // Iniciar sesión
      props.navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {lista.map((list, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              props.navigation.navigate('Provincias', { nombreComunidad: list.nombre })
            }
          >
            {imagenes[list.idcomunidad] && (
              <Image source={{ uri: imagenes[list.idcomunidad] }} style={styles.flagImage} />
            )}
            <Text style={styles.cardText}>{list.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Icon name={userLoggedIn ? 'sign-out' : 'sign-in'} size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.chatButton} onPress={() => props.navigation.navigate('Chat')}>
        <Icon name="comments" size={24} color="white" />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffc00', // Fondo gris claro
  },
  scrollView: {
    alignItems: 'center', // Centra verticalmente las tarjetas
  },
  card: {
    width: '90%',
    backgroundColor: '#ffdb00', // Amarillo dorado
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 5,
    borderWidth: 2,
    borderColor: '#ad1519', // Borde rojo
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ad1519', // Rojo oscuro
  },
  flagImage: {
    width: 40, // Ajustar el ancho de la imagen según sea necesario
    height: 30, // Ajustar la altura de la imagen según sea necesario
    marginRight: 20, // Espacio entre la imagen de la bandera y el texto
    borderRadius: 5,
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00008B', // Azul oscuro
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    position: 'absolute',
    top: 20,
    right: 20, // Ajusta la posición a la derecha
    backgroundColor: '#ad1519', // Rojo oscuro
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    alignItems: 'center',
    marginTop: 10, // Ajusta el margen superior para separar del contenido
  },
});
