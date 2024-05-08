import React, { useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";

export default function Chat() {
  const [messages, setMessages] = useState([]);

  // Función para manejar el envío de mensajes
  const onSend = (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  return <GiftedChat messages={messages} onSend={onSend} />;
}
