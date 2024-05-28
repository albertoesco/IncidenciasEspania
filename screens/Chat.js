// Importaciones necesarias de React, React Native y Firebase
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '../firebase/credenciales';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

// Componente principal de Chat
export default function Chat() {
  // Definición de estados
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation(); // Hook para la navegación

  // useEffect para la autenticación del usuario y suscripción a los mensajes
  useEffect(() => {
    const auth = getAuth();

    // Escuchar cambios en la autenticación del usuario
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUsername(currentUser.email.split('@')[0]); // Extrae el nombre de usuario del email
      } else {
        setUser(null);
        setUsername('');
      }
    });

    // Consulta para ordenar los mensajes por fecha en orden descendente
    const q = query(collection(db, "mensajes"), orderBy("fecha", "desc"));

    // Suscribirse a los cambios en la colección de mensajes
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.texto,
          createdAt: data.fecha ? data.fecha.toDate() : new Date(),
          user: {
            _id: data.usuario,
            name: data.usuario_nombre || '',
          },
        };
      });
      setMessages(messagesData); // Actualiza el estado de los mensajes
    });

    // Limpiar suscripciones cuando el componente se desmonte
    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, []);

  // Función para enviar un nuevo mensaje
  const onSend = async (newMessages = []) => {
    if (!user) {
      setModalVisible(true); // Mostrar modal si no hay usuario autenticado
      return;
    }
    const message = newMessages[0];
    try {
      await addDoc(collection(db, "mensajes"), {
        texto: message.text,
        usuario: user.uid,
        usuario_nombre: username,
        fecha: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Renderizar el componente de chat
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#18315f" />
      </TouchableOpacity>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={user ? { _id: user.uid, name: username } : null}
      />
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Icon name="error" size={50} color="red" />
          <Text style={styles.modalText}>Debe iniciar sesión para enviar mensajes</Text>
          <Button title="Cerrar" onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
}

// Estilos para el modal y el botón de retroceso
const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
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
