import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import appFirebase from "../firebase/credenciales";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function NewIncidencia({ route, navigation, setIncidencias }) {
    const { nombreComunidad, nombreProvincia } = route.params;

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('');

    const handleNewIncidencia = async () => {
        try {
            if (!nombre.trim() || !descripcion.trim() || !estado.trim()) {
                alert('Por favor ingrese todos los campos');
                return;
            }

            // Obtener la fecha actual
            const fechaActual = new Date();
            // Formatear la fecha según tu preferencia (por ejemplo, formato ISO)
            const fechaFormateada = fechaActual.toISOString();

            // Crear nueva incidencia en la base de datos
            await addDoc(collection(db, 'comunidades', nombreComunidad, 'provincias', nombreProvincia, 'incidencias'), {
                nombre: nombre,
                descripcion: descripcion,
                estado: estado, // Añadir el estado a la nueva incidencia
                fecha: fechaFormateada // Agregar la fecha formateada
            });

            navigation.goBack();
            setIncidencias(prevIncidencias => [...prevIncidencias, { nombre: nombre, descripcion: descripcion, estado: estado, fecha: fechaFormateada }]);
        } catch (error) {
            console.error('Error al crear incidencia:', error);
        }
    };

    // Función para navegar a la pantalla de captura de imagen
    const openFotoScreen = () => {
        navigation.navigate('Foto'); // Cambia 'CapturarImagen' al nombre que elijas
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
            />
            <Text style={styles.label}>Descripción:</Text>
            <TextInput
                style={styles.input}
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
            />
            <Text style={styles.label}>Estado:</Text>
            <TextInput
                style={styles.input}
                value={estado}
                onChangeText={setEstado}
            />
            <Button title="Foto" onPress={openFotoScreen} />
            <Button title="Crear Incidencia" onPress={handleNewIncidencia} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});
