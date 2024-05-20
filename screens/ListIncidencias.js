import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import appFirebase from "../firebase/credenciales";
import { getFirestore, collection, onSnapshot, deleteDoc } from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function ListIncidencias({ route, navigation }) {
    const { nombreComunidad, nombreProvincia } = route.params;
    const [incidencias, setIncidencias] = useState([]);

    useEffect(() => {
        const getIncidencias = async () => {
            try {
                const incidenciasRef = collection(db, "comunidades", nombreComunidad, "provincias", nombreProvincia, "incidencias");
                const unsubscribe = onSnapshot(incidenciasRef, (snapshot) => {
                    const incidenciasData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                        ref: doc.ref // Almacenar la referencia completa del documento
                    }));
                    setIncidencias(incidenciasData);
                });
                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching incidencias: ", error);
            }
        };

        getIncidencias();
    }, [nombreProvincia, nombreComunidad]);

    const handleIncidenciaPress = (incidencia) => {
        navigation.navigate("Detail", { incidencia });
    };

    const handleNewIncidencia = () => {
        navigation.navigate("New", { nombreComunidad, nombreProvincia });
    };

    const handleDeleteIncidencia = async (incidencia) => {
        try {
            await deleteDoc(incidencia.ref); // Usar la referencia almacenada para eliminar la incidencia
            console.log("Incidencia eliminada con éxito");
        } catch (error) {
            console.error("Error deleting incidencia: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Incidencias de {nombreProvincia}</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleNewIncidencia}>
                    <Icon name="plus" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {incidencias.map((incidencia, index) => (
                    <TouchableOpacity key={index} style={styles.card} onPress={() => handleIncidenciaPress(incidencia)}>
                        <Text style={styles.cardText}>{incidencia.data.nombre}</Text>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteIncidencia(incidencia)}>
                            <Text style={styles.deleteButtonText}>Eliminar</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fffc00", // Fondo amarillo dorado
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ad1519", // Texto rojo oscuro
    },
    scrollView: {
        alignItems: "center",
        paddingBottom: 20, // Espacio adicional para que el último elemento no quede tapado
    },
    card: {
        width: "90%", // Ancho ajustado para evitar que toque los bordes
        backgroundColor: "#ffdb00", // Fondo amarillo dorado
        padding: 20,
        marginVertical: 10,
        borderRadius: 15,
        elevation: 5,
        shadowColor: "#ad1519", // Color de sombra rojo oscuro
        shadowOpacity: 0.2, // Opacidad de la sombra
        shadowRadius: 5, // Radio de la sombra
        shadowOffset: {
            width: 0,
            height: 2,
        },
        flexDirection: "row", // Alinear el botón de eliminación a la derecha
        justifyContent: "space-between", // Alinear elementos a los extremos
        alignItems: "center", // Alinear verticalmente
    },
    cardText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        color: "#ad1519", // Texto rojo oscuro
    },
    deleteButton: {
        backgroundColor: "#dc3545", // Color de fondo rojo
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    deleteButtonText: {
        color: "#fff", // Texto blanco
        fontSize: 16,
        fontWeight: "bold",
    },
    addButton: {
        backgroundColor: "#00008B", // Fondo azul oscuro
        borderRadius: 25,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    addButtonText: {
        color: "#fff", // Texto blanco
        fontSize: 18,
        fontWeight: "bold",
    },
});
