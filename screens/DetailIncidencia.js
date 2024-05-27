import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import appFirebase from "../firebase/credenciales";
import { getFirestore, updateDoc } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker';

const db = getFirestore(appFirebase);

export default function DetailIncidencia({ route }) {
  const { incidencia, nombreProvincia } = route.params;
  const [editing, setEditing] = useState(false);
  const [newEstado, setNewEstado] = useState(incidencia.data.estado);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEditEstado = () => {
    setEditing(true);
  };

  const handleSaveEstado = async () => {
    if (!newEstado.trim()) {
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
        }, 2000); 
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
      <Text style={styles.title}>Detalle de Incidencia ({incidencia.data.nombre})</Text>
      <View style={styles.item}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={[styles.value, styles.italic]}> {incidencia.data.nombre}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={[styles.value, styles.italic]}> {incidencia.data.descripcion}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Fecha:</Text>
        <Text style={[styles.value, styles.italic]}> {incidencia.data.fecha}</Text>
      </View>
      <View style={styles.estadoContainer}>
        <Text style={[styles.estadoText, styles.bold]}>Estado:</Text>
        {editing ? (
          <View style={styles.editContainer}>
            <Picker
              selectedValue={newEstado}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setNewEstado(itemValue)
              }>
              <Picker.Item label="Pendiente" value="Pendiente" />
              <Picker.Item label="En Proceso" value="En Proceso" />
              <Picker.Item label="Resuelto" value="Resuelto" />
              <Picker.Item label="Cancelado" value="Cancelado" />
            </Picker>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEstado}>
              <Text style={[styles.saveButtonText, styles.italic]}>Guardar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.estadoValueContainer}>
            <Ionicons name="checkmark-done" size={24} color="#fff" style={[styles.icon, styles.bold]} />
            <Text style={[styles.estadoValue, styles.italic]}>{incidencia.data.estado}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditEstado}>
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {incidencia.data.uri && (
        <Image source={{ uri: incidencia.data.uri }} style={styles.image} /> 
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Icon name="check-circle" size={80} color="#4a90e2" />
          <Text style={styles.modalText}>Estado actualizado correctamente</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',
    color: "#18315f",
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "#18315f",
  },
  value: {
    fontSize: 18,
    marginBottom: 5,
    color: "#18315f",
  },
  italic: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#18315f',
    padding: 10,
    borderRadius: 10,
    marginLeft: 25,
    marginRight: 25,
  },
  estadoText: {
    fontSize: 18,
    marginRight: 10,
    color: "#fff",
  },
  estadoValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  estadoValue: {
    fontSize: 18,
    color: "#fff",
  },
  editButton: {
    marginLeft: 10,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#18315f",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    color: "#18315f",
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#18315f",
    padding: 10,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalText: {
    marginTop: 20,
    fontSize: 20,
    color: "#fff",
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    resizeMode: 'cover',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#18315f",
  },
  picker: {
    height: 50,
    width: 150,
    color: '#fff',
    backgroundColor: '#18315f',
  },
});
