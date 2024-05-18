import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { storage } from '../firebase/credenciales';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function Foto() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access camera was denied');
      }
    })();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Necesitamos tu permiso para mostrar la cámara</Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Foto capturada:', photo.uri);

      const storageRef = ref(storage, `comunidades/nombreComunidad/provincias/nombreProvincia/incidencias/${new Date().getTime()}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, photo.base64);
      console.log('Foto subida con éxito:', uploadTask);

      const downloadURL = await getDownloadURL(uploadTask.ref);
      console.log('Foto disponible en:', downloadURL);
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      alert('Error al tomar la foto. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      {permission.granted && (
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
      )}
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