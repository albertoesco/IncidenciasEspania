import React, { useState, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from '../firebase/credenciales'; // Importa la instancia de Firebase Firestore

export default function Chat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "mensajes"), (snapshot) => {
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
  
    return () => unsubscribe();
  }, []);

  const onSend = async (newMessages = []) => {
    const message = newMessages[0];
    try {
      await addDoc(collection(db, "mensajes"), {
        texto: message.text,
        usuario: message.user._id,
        fecha: serverTimestamp(), // Guarda la marca de tiempo actual
      });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return <GiftedChat messages={messages} onSend={onSend} user={{ _id: 1 }} />;
}
