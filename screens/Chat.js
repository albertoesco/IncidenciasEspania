import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '../firebase/credenciales'; // Importa la instancia de Firebase Firestore
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUsername(currentUser.email.split('@')[0]);  // Obtener la parte antes del '@' del correo electrónico
      } else {
        setUser(null);
        setUsername('');
      }
    });

    const q = query(collection(db, "mensajes"), orderBy("fecha", "desc"));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.texto,
          createdAt: data.fecha ? data.fecha.toDate() : new Date(), // Verifica si fecha es null
          user: {
            _id: data.usuario,
            name: data.usuario_nombre || '', // Verifica si usuario_nombre está presente
          },
        };
      });
      setMessages(messagesData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, []);

  const onSend = async (newMessages = []) => {
    if (!user) {
      setModalVisible(true); // Muestra el modal de error
      return;
    }
    const message = newMessages[0];
    try {
      await addDoc(collection(db, "mensajes"), {
        texto: message.text,
        usuario: user.uid,
        usuario_nombre: username,  // Agregar el nombre del usuario al mensaje
        fecha: serverTimestamp(), // Guarda la marca de tiempo actual
      });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat messages={messages} onSend={onSend} user={user ? { _id: user.uid, name: username } : null} />
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

const styles = StyleSheet.create({
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
