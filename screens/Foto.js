// Importaciones necesarias de React, React Native y Expo
import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

// Componente principal para tomar fotos
export default function Foto({ route }) {
  // Estado para la cámara frontal o trasera
  const [facing, setFacing] = useState('back');
  // Permisos de la cámara
  const [permission, requestPermission] = useCameraPermissions();
  // Referencia a la cámara
  const cameraRef = useRef(null);

  // Si no se han solicitado los permisos, mostrar una vista vacía
  if (!permission) {
    return <View />;
  }

  // Si los permisos no han sido concedidos, mostrar un mensaje y un botón para solicitarlos
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // Obtener los parámetros pasados a este componente
  const { nombreComunidad, nombreProvincia } = route.params;

  console.log("Nombre de la Comunidad:", nombreComunidad);
  console.log("Nombre de la Provincia:", nombreProvincia);

  // Función para alternar entre la cámara frontal y trasera
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Función para tomar una foto
  async function takePicture() {
    if (cameraRef.current) {
      const options = { quality: 1 }; // Opciones de calidad de la foto
      const photo = await cameraRef.current.takePictureAsync(options);
      savePhotoToGallery(photo.uri); // Guardar la foto en la galería
      console.log("Picture taken!");
    }
  }

  // Función para guardar la foto en la galería
  async function savePhotoToGallery(uri) {
    try {
      await MediaLibrary.saveToLibraryAsync(uri);
      console.log("Photo saved to gallery.");
    } catch (error) {
      console.error("Error saving photo to gallery:", error);
    }
  }

  // Renderizar el componente
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
