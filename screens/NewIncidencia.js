import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import appFirebase from "../firebase/credenciales";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import Icon from 'react-native-vector-icons/MaterialIcons';

const db = getFirestore(appFirebase);

export default function NewIncidencia({ route }) {
    const { nombreComunidad, nombreProvincia, uri, setIncidencias } = route.params;
    const navigation = useNavigation();

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('');
    const [fotoSeleccionada, setFotoSeleccionada] = useState(uri);
    const [error, setError] = useState(null);
    const [errorFoto, setErrorFoto] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalFotoVisible, setModalFotoVisible] = useState(false);

    const handleNewIncidencia = async () => {
        if (!nombre.trim() || !descripcion.trim() || !estado.trim()) {
            setError('Por favor ingrese todos los campos');
            setModalVisible(true);
            setTimeout(() => {
                setModalVisible(false);
            }, 3000);
            return;
        }

        if (!uri.trim()) {
            setErrorFoto('Por favor seleccione una foto');
            setModalFotoVisible(true);
            setTimeout(() => {
                setModalFotoVisible(false);
            }, 3000);
            return;
        }

        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toISOString();

        try {
            await addDoc(collection(db, 'comunidades', nombreComunidad, 'provincias', nombreProvincia, 'incidencias'), {
                nombre: nombre,
                descripcion: descripcion,
                estado: estado,
                fecha: fechaFormateada,
                uri: uri
            });
            navigation.goBack();
            if (setIncidencias) {
                setIncidencias(prevIncidencias => [...prevIncidencias, { nombre: nombre, descripcion: descripcion, estado: estado, fecha: fechaFormateada, uri: uri }]);
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
                    <TextInput
                        style={styles.input}
                        value={estado}
                        onChangeText={setEstado}
                    />
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
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalFotoVisible}
                    onRequestClose={() => setModalFotoVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Icon name="error" size={24} color="#FF0000" />
                            <Text style={styles.modalText}>{errorFoto}</Text>
                        </View>
                    </View>
                </Modal>
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
});
