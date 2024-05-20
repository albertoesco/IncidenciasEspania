import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import appFirebase from "../firebase/credenciales";
import { getFirestore, updateDoc } from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function DetailIncidencia({ route }) {
  const { incidencia } = route.params;
  const [editing, setEditing] = useState(false);
  const [newEstado, setNewEstado] = useState(incidencia.data.estado);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEditEstado = () => {
    setEditing(true);
  };

  const handleSaveEstado = async () => {
    if (newEstado.trim() === "") {
      Alert.alert("Error", "El estado no puede estar vacío.");
      return;
    }

    try {
      if (incidencia.ref) {
        await updateDoc(incidencia.ref, {
          estado: newEstado,
        });
        incidencia.data.estado = newEstado;
        setEditing(false);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
        }, 2000); // Cerrar modal después de 2 segundos
      } else {
        console.error("Referencia del documento no válida:", incidencia.ref);
        Alert.alert("Error", "Referencia del documento no válida.");
      }
    } catch (error) {
      console.error("Error updating incidencia: ", error);
      Alert.alert("Error", "No se pudo actualizar el estado.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{incidencia.data.nombre}</Text>
      <Text style={styles.text}>Descripción: {incidencia.data.descripcion}</Text>
      <Text style={styles.text}>Fecha: {incidencia.data.fecha}</Text>
      <View style={styles.estadoContainer}>
        <Text style={styles.estadoText}>Estado:</Text>
        {editing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={newEstado}
              onChangeText={(text) => setNewEstado(text)}
              placeholder="Nuevo estado"
              autoFocus
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEstado}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.estadoValueContainer}>
            <Text style={styles.estadoValue}>{incidencia.data.estado}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditEstado}>
              <Ionicons name="create-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {incidencia.data.uri && ( // Verifica si hay una URI de imagen
        <Image source={{ uri: incidencia.data.uri }} style={styles.image} /> // Muestra la imagen si está disponible
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Icon name="check-circle" size={80} color="green" />
          <Text style={styles.modalText}>Estado actualizado correctamente</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffc00", // Fondo amarillo dorado
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ad1519", // Texto rojo oscuro
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    color: "#ad1519", // Texto rojo oscuro
  },
  estadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  estadoText: {
    fontSize: 18,
    marginRight: 10,
    color: "#ad1519",
  },
  estadoValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  estadoValue: {
    fontSize: 18,
    color: "#ad1519",
  },
  editButton: {
    marginLeft: 10,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editInput: {
    width: 150,
    borderWidth: 1,
    borderColor: "#ad1519",
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#ad1519",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo más opaco
  },
  modalText: {
    marginTop: 20,
    fontSize: 20,
    color: "#fff", // Texto blanco para que sea más visible
  },
  image: {
    width: 300, // Ancho deseado de la imagen
    height: 300, // Alto deseado de la imagen
    marginTop: 20, // Espacio superior
    resizeMode: 'cover', // Ajuste de la imagen
  },
});
