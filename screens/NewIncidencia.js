import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import appFirebase from "../firebase/credenciales";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import Icon from 'react-native-vector-icons/MaterialIcons';

const db = getFirestore(appFirebase);

export default function NewIncidencia({ route, setIncidencias }) {
    const { nombreComunidad, nombreProvincia, uri } = route.params;
    const navigation = useNavigation();

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('');
    const [fotoSeleccionada, setFotoSeleccionada] = useState(uri);
    const [error, setError] = useState(null);

    const handleNewIncidencia = async () => {
        if (!nombre.trim() || !descripcion.trim() || !estado.trim() || !uri.trim()) {
            setError('Por favor ingrese todos los campos');
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
            setIncidencias(prevIncidencias => [...prevIncidencias, { nombre: nombre, descripcion: descripcion, estado: estado, fecha: fechaFormateada, uri: uri }]);
        } catch (e) {
            console.error('Error al crear incidencia:', e.message, e.stack);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nueva Incidencia</Text>
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
                <Button title="Abrir Galería" onPress={() => navigation.navigate('Galeria', {nombreComunidad, nombreProvincia})} />
                <Button title="Crear Incidencia" onPress={handleNewIncidencia} />
            </View>
            {fotoSeleccionada && (
                <View style={styles.imageContainer}>
                    <Text style={styles.label}>Foto Seleccionada:</Text>
                    <Image source={{ uri: fotoSeleccionada }} style={styles.image} />
                </View>
            )}
            {error && (
                <View style={styles.errorContainer}>
                    <Icon name="error" size={24} color="red" />
                    <Text style={styles.errorMessage}>{error}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
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
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    errorMessage: {
        color: 'red',
        marginLeft: 5,
    },
});
