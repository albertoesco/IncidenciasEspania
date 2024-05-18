import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button } from "react-native";
import appFirebase from "../firebase/credenciales";
import { getFirestore, collection, getDocs, onSnapshot, deleteDoc } from "firebase/firestore";

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
            <Text style={styles.title}>Incidencias de {nombreProvincia}</Text>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {incidencias.map((incidencia, index) => (
                    <TouchableOpacity key={index} style={styles.card} onPress={() => handleIncidenciaPress(incidencia.data)}>
                        <Text style={styles.cardText}>{incidencia.data.nombre}</Text>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteIncidencia(incidencia)}>
                            <Text style={styles.deleteButtonText}>Eliminar</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={handleNewIncidencia}>
                <Text style={styles.addButtonText}>Nueva Incidencia</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fffc00", // Fondo amarillo dorado
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        marginLeft: 20,
        marginTop: 10,
        color: "#ad1519", // Texto rojo oscuro
    },
    scrollView: {
        alignItems: "center",
    },
    card: {
        width: "100%", // Ancho máximo
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
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#00008B", // Fondo azul oscuro
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 25,
        elevation: 5,
        shadowColor: "#000", // Color de sombra negro
        shadowOpacity: 0.2, // Opacidad de la sombra
        shadowRadius: 5, // Radio de la sombra
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    addButtonText: {
        color: "#fff", // Texto blanco
        fontSize: 18,
        fontWeight: "bold",
    },
});
