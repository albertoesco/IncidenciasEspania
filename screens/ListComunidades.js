// Importaciones necesarias de React, React Native y Expo
import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/FontAwesome';
import appFirebase from '../firebase/credenciales';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';

// Inicializar Firestore y Storage de Firebase
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

// Componente principal para listar las comunidades
export default function ListComunidades(props) {
  const [lista, setLista] = useState([]); // Estado para almacenar la lista de comunidades
  const [imagenes, setImagenes] = useState({}); // Estado para almacenar las URLs de las imágenes de las comunidades
  const scaleValue = new Animated.Value(1); // Valor de animación para escala
  const rotateValue = new Animated.Value(0); // Valor de animación para rotación
  const { currentUser } = useAuth(); // Estado del usuario autenticado
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const navigation = useNavigation(); // Hook para la navegación

  // Efecto para la animación de rotación
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolación de la animación de rotación
  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Efecto para obtener la lista de comunidades de Firestore
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

  // Efecto para obtener las URLs de las imágenes de las comunidades de Firebase Storage
  useEffect(() => {
    const obtenerImagenes = async () => {
      const imagenes = {};
      for (const comunidad of lista) {
        const imagePath = `comunidades/${comunidad.nombre}/${comunidad.nombre}.jpg`;
        try {
          const url = await getDownloadURL(ref(storage, imagePath));
          imagenes[comunidad.idcomunidad] = url;
        } catch (error) {
          console.error(`Error al obtener la imagen de ${comunidad.nombre}:`, error);
        }
      }
      setImagenes(imagenes);
    };
    obtenerImagenes();
  }, [lista]);

  // Función para manejar el login
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  // Funciones para manejar la animación de presión de botones
  const handleButtonPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Función para abrir el chat, mostrando el modal si no está autenticado
  const openChat = () => {
    if (!currentUser) {
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Login');
      }, 2000);
    } else {
      props.navigation.navigate('Chat');
    }
  };

  // Renderizar el componente
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {lista.map((list, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => props.navigation.navigate('Provincias', { nombreComunidad: list.nombre })}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          >
            {imagenes[list.idcomunidad] && (
              <Image source={{ uri: imagenes[list.idcomunidad] }} style={styles.flagImage} />
            )}
            <Text style={styles.cardText}>{list.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        onPressIn={handleButtonPressIn}
        onPressOut={handleButtonPressOut}
      >
        <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleValue }, { rotate: spin }] }]}>
          {currentUser ? (
            <Icon name="sign-out" size={24} color="white" />
          ) : (
            <Icon name="user-circle" size={24} color="white" />
          )}
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={openChat}
        onPressIn={handleButtonPressIn}
        onPressOut={handleButtonPressOut}
      >
        <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleValue }, { rotate: spin }] }]}>
          <Icon name="comments" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
      <StatusBar style="auto" />

      <Modal isVisible={modalVisible}>
        <View style={styles.modalContent}>
          <Icon name="exclamation-circle" size={50} color="red" />
          <Text style={styles.modalText}>Debe iniciar sesión para acceder al chat</Text>
        </View>
      </Modal>
    </View>
  );
}

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 5,
    borderWidth: 3,
    borderColor: '#18315f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#18315f',
  },
  flagImage: {
    width: 40,
    height: 30,
    marginRight: 20,
    borderRadius: 5,
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#18315f',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#737373',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
});
