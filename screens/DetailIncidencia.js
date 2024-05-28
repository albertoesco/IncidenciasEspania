import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image, Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import appFirebase from "../firebase/credenciales";
import { getFirestore, updateDoc } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

// Obtener instancia de Firestore
const db = getFirestore(appFirebase);

export default function DetailIncidencia({ route }) {
  const { incidencia, nombreProvincia } = route.params; // Obtener los parámetros pasados a este componente
  const [editing, setEditing] = useState(false); // Estado para determinar si se está editando el estado
  const [newEstado, setNewEstado] = useState(incidencia.data.estado); // Estado para el nuevo estado de la incidencia
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const navigation = useNavigation(); // Hook para la navegación

  // Función para activar el modo de edición del estado
  const handleEditEstado = () => {
    setEditing(true);
  };

  // Función para guardar el nuevo estado en Firestore
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
        }, 2000); // Ocultar modal después de 2 segundos
      } else {
        console.error("Referencia del documento no válida:", incidencia.ref);
        Alert.alert("Error", "Referencia del documento no válida.");
      }
    } catch (error) {
      console.error("Error updating incidencia: ", error);
      Alert.alert("Error", "No se pudo actualizar el estado.");
    }
  };

  // Función para obtener el estilo de fondo según el estado
  const getEstadoStyle = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return styles.estadoPendiente;
      case 'En Proceso':
        return styles.estadoEnProceso;
      case 'Resuelto':
        return styles.estadoResuelto;
      case 'Cancelado':
        return styles.estadoCancelado;
      default:
        return styles.estadoDefault;
    }
  };

  // Función para abrir la ubicación en una aplicación de mapas
  const handleOpenMaps = () => {
    const { latitude, longitude } = incidencia.data.ubicacion;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  // Renderizar el componente de detalle de incidencia
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#18315f" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Detalle de Incidencia ({incidencia.data.nombre})</Text>
      </View>
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
      <View style={[styles.estadoContainer, getEstadoStyle(incidencia.data.estado)]}>
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
      {incidencia.data.ubicacion && (
        <View style={styles.locationContainer}>
          <Text style={styles.label}>Ubicación:</Text>
          <Text style={styles.value}>{`Lat: ${incidencia.data.ubicacion.latitude}, Lon: ${incidencia.data.ubicacion.longitude}`}</Text>
          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMaps}>
            <Text style={styles.mapButtonText}>Ver en Mapa</Text>
          </TouchableOpacity>
        </View>
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

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 5,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: 'center',
    color: "#18315f",
    marginTop: 5,
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
  saveButton: {
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
    color: '#000',
    backgroundColor: '#fff',
  },
  estadoPendiente: {
    backgroundColor: '#FFA500',
  },
  estadoEnProceso: {
    backgroundColor: '#1E90FF',
  },
  estadoResuelto: {
    backgroundColor: '#32CD32',
  },
  estadoCancelado: {
    backgroundColor: '#FF0000',
  },
  estadoDefault: {
    backgroundColor: '#18315f',
  },
  locationContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  mapButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4a90e2',
    borderRadius: 5,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
