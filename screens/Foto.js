import React, { useState, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/storage';

export default function Foto() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null); // Crear la referencia

  if (!permission) {
    // Carga de permisos de la cámara
    return <View />;
  }

  if (!permission.granted) {
    // Permisos de cámara no otorgados
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Necesitamos tu permiso para mostrar la cámara</Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  function toggleCameraType() {
    // Cambiar entre la cámara frontal y trasera
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync(); // Capturar la foto
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Construir la ruta de almacenamiento
        const storageRef = firebase.storage().ref();
        const incidenciasRef = storageRef.child(`comunidades/Andalucía/provincias/Almería/incidencias`);
        const fotoRef = incidenciasRef.child(`foto_${new Date().getTime()}.jpg`); // Generar un nombre único para la foto
  
        // Subir la foto al almacenamiento
        await fotoRef.put(blob);
  
        console.log('Foto capturada y almacenada correctamente');
      } catch (error) {
        console.error('Error al tomar y almacenar la foto:', error);
      }
    }
  }
  

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Cambiar cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Tomar foto</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

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
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    margin: 20,
  },
  button: {
    alignSelf: 'flex-end',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
