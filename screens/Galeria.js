import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';

// Componente principal de la galería
export default function Galeria({ route, navigation }) {
  // Estados para manejar la imagen, la cámara (frontal/trasera) y los permisos
  const [image, setImage] = useState(null);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const { nombreComunidad, nombreProvincia } = route.params;

  // Función para seleccionar una imagen de la galería
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      navigation.navigate('New', { uri: result.assets[0].uri, nombreComunidad, nombreProvincia });
    }
  };

  // Función para tomar una foto con la cámara
  const takePhoto = async () => {
    let { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requieren permisos de cámara para tomar una foto.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      navigation.navigate('New', { uri: result.assets[0].uri, nombreComunidad, nombreProvincia });
    }
  };

  // Función para cambiar entre la cámara frontal y trasera
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Manejo de permisos: si no hay permisos, muestra una vista vacía o un mensaje para solicitarlos
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Se necesitan permisos para mostrar la cámara</Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  // Renderiza la vista principal con botones para tomar foto, abrir galería y cambiar cámara
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.text}>Tomar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.text}>Abrir Galería</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Cambiar Cámara</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <CameraView style={styles.camera} facing={facing} />
    </View>
  );
}

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#18315f',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 10,
  },
  camera: {
    flex: 1,
  },
});
