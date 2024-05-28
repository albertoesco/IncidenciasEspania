import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import appFirebase from "../firebase/credenciales";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import * as Animatable from 'react-native-animatable';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

// Inicializar Firestore y Storage con las credenciales de Firebase
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

export default function NewIncidencia({ route }) {
    const { nombreComunidad, nombreProvincia, uri, setIncidencias } = route.params;
    const navigation = useNavigation();

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('Pendiente');
    const [fotoSeleccionada, setFotoSeleccionada] = useState(uri);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [ubicacion, setUbicacion] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);

    const handleGetLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'La aplicación necesita permisos de ubicación para funcionar correctamente.');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUbicacion(location.coords);
        setMapVisible(true);
    };

    const handleNewIncidencia = async () => {
        if (!nombre.trim() || !descripcion.trim() || !estado.trim() || !uri.trim() || !ubicacion) {
            setError('Por favor ingrese todos los campos, incluyendo la foto y la ubicación');
            setModalVisible(true);
            setTimeout(() => {
                setModalVisible(false);
            }, 3000);
            return;
        }

        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toISOString();

        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storagePath = `comunidades/${nombreComunidad}/provincias/${nombreProvincia}/incidencias/${fechaFormateada}_${nombreComunidad}_${nombreProvincia}.jpg`;
            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(storageRef);

            await addDoc(collection(db, 'comunidades', nombreComunidad, 'provincias', nombreProvincia, 'incidencias'), {
                nombre: nombre,
                descripcion: descripcion,
                estado: estado,
                fecha: fechaFormateada,
                uri: downloadURL,
                ubicacion
            });

            navigation.goBack();
            if (setIncidencias) {
                setIncidencias(prevIncidencias => [...prevIncidencias, { nombre, descripcion, estado, fecha: fechaFormateada, uri: downloadURL, ubicacion }]);
            }
        } catch (e) {
            console.error('Error al crear incidencia:', e.message, e.stack);
        }
    };

    const handleMapPress = (event) => {
        setUbicacion(event.nativeEvent.coordinate);
    };

    const handleConfirmLocation = () => {
        setMapVisible(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color="#18315f" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Nueva Incidencia en {nombreProvincia}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre:</Text>
                    <TextInput
                        style={styles.input}
                        value={nombre}
                        onChangeText={setNombre}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Descripción:</Text>
                    <TextInput
                        style={[styles.input, styles.multilineInput]}
                        value={descripcion}
                        onChangeText={setDescripcion}
                        multiline
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Estado:</Text>
                    <Animatable.View animation="fadeIn" duration={500} style={styles.pickerContainer}>
                        <Picker
                            selectedValue={estado}
                            onValueChange={(itemValue, itemIndex) => setEstado(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Pendiente" value="Pendiente" />
                            <Picker.Item label="En Proceso" value="En Proceso" />
                            <Picker.Item label="Resuelto" value="Resuelto" />
                        </Picker>
                    </Animatable.View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Galeria', { nombreComunidad, nombreProvincia })}>
                        <Text style={styles.buttonText}>Seleccionar Imagen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleNewIncidencia}>
                        <Text style={styles.buttonText}>Crear Incidencia</Text>
                    </TouchableOpacity>
                </View>
                {fotoSeleccionada && (
                    <View style={styles.imageContainer}>
                        <Text style={styles.label}>Foto Seleccionada:</Text>
                        <Image source={{ uri: fotoSeleccionada }} style={styles.image} />
                    </View>
                )}
                {ubicacion && (
                    <View style={styles.locationContainer}>
                        <Text style={styles.label}>Ubicación Seleccionada:</Text>
                        <Text>{`Lat: ${ubicacion.latitude}, Lon: ${ubicacion.longitude}`}</Text>
                    </View>
                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Icon name="error" size={24} color="#FF0000" />
                            <Text style={styles.modalText}>{error}</Text>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={mapVisible}
                    onRequestClose={() => setMapVisible(false)}
                >
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: ubicacion ? ubicacion.latitude : 37.78825,
                                longitude: ubicacion ? ubicacion.longitude : -122.4324,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            onPress={handleMapPress}
                        >
                            {ubicacion && <Marker coordinate={ubicacion} />}
                        </MapView>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
                            <Text style={styles.confirmButtonText}>Confirmar Ubicación</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={handleGetLocation}
                >
                    <Icon name="location-on" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 3,
        borderBottomColor: '#18315f',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#18315f',
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#3F51B5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginTop: 10,
    },
    locationContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalText: {
        fontSize: 18,
        color: '#FF0000',
        textAlign: 'center',
        marginTop: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
    },
    picker: {
        height: 40,
        color: '#333',
    },
    mapContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    confirmButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: '#3F51B5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    locationButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: '#3F51B5',
        borderRadius: 50,
        padding: 10,
        elevation: 5,
    },
});
