import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function Galeria({ route, navigation }) {
  const [image, setImage] = useState(null);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const { nombreComunidad, nombreProvincia } = route.params;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    console.log("estoy en galeria", nombreComunidad, nombreProvincia)
    if (!result.cancelled) {
      navigation.navigate('New', { uri: result.assets[0].uri, nombreComunidad, nombreProvincia });
    }
  };

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
  
    console.log(result);
  
    if (!result.cancelled) {
      navigation.navigate('New', { uri: result.assets[0].uri, nombreComunidad, nombreProvincia });
    }
  };
  
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

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
    backgroundColor: '#18315f'
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
