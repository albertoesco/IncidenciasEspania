import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import appFirebase from "../firebase/credenciales";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import * as Animatable from 'react-native-animatable';

// Inicializar Firestore y Storage con las credenciales de Firebase
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

export default function NewIncidencia({ route }) {
    // Obtener parámetros de la ruta
    const { nombreComunidad, nombreProvincia, uri, setIncidencias } = route.params;
    const navigation = useNavigation();

    // Definir estados para manejar el formulario y las interacciones del usuario
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('Pendiente');
    const [fotoSeleccionada, setFotoSeleccionada] = useState(uri);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Función para manejar la creación de una nueva incidencia
    const handleNewIncidencia = async () => {
        // Validar que los campos del formulario no estén vacíos
        if (!nombre.trim() || !descripcion.trim() || !estado.trim() || !uri.trim()) {
            setError('Por favor ingrese todos los campos, incluyendo la foto');
            setModalVisible(true);
            setTimeout(() => {
                setModalVisible(false);
            }, 3000);
            return;
        }

        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toISOString();

        try {
            // Subir imagen a Firebase Storage
            const response = await fetch(uri);
            const blob = await response.blob();
            const storagePath = `comunidades/${nombreComunidad}/provincias/${nombreProvincia}/incidencias/${fechaFormateada}_${nombreComunidad}_${nombreProvincia}.jpg`;
            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, blob);

            // Obtener URL de descarga de la imagen
            const downloadURL = await getDownloadURL(storageRef);

            // Crear documento de la incidencia en Firestore con la URL de la imagen
            await addDoc(collection(db, 'comunidades', nombreComunidad, 'provincias', nombreProvincia, 'incidencias'), {
                nombre: nombre,
                descripcion: descripcion,
                estado: estado,
                fecha: fechaFormateada,
                uri: downloadURL  // Usar la URL de descarga
            });

            // Navegar de regreso y actualizar la lista de incidencias si es necesario
            navigation.goBack();
            if (setIncidencias) {
                setIncidencias(prevIncidencias => [...prevIncidencias, { nombre: nombre, descripcion: descripcion, estado: estado, fecha: fechaFormateada, uri: downloadURL }]);
            }
        } catch (e) {
            console.error('Error al crear incidencia:', e.message, e.stack);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
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
            </View>
        </ScrollView>
    );
}

// Estilos para el componente
const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    titleContainer: {
        width: '100%',
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
});
