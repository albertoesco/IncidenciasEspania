import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button } from "react-native";
import appFirebase from "../firebase/credenciales";
import { getFirestore, collection, getDocs, onSnapshot } from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function ListIncidencias({ route, navigation }) {
    const { nombreComunidad, nombreProvincia } = route.params;
    const [incidencias, setIncidencias] = useState([]);
    const [selectedIncidencia, setSelectedIncidencia] = useState(null);

    useEffect(() => {
        const getIncidencias = async () => {
            try {
                const incidenciasRef = collection(db, "comunidades", nombreComunidad, "provincias", nombreProvincia, "incidencias");
                const unsubscribe = onSnapshot(incidenciasRef, (snapshot) => {
                    const incidenciasData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
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
        setSelectedIncidencia(incidencia);
        navigation.navigate("Detail", { incidencia });
    };

    const handleNewIncidencia = () => {
        navigation.navigate("New", { nombreComunidad, nombreProvincia });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Incidencias de {nombreProvincia}</Text>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {incidencias.map((incidencia, index) => (
                    <TouchableOpacity key={index} style={styles.card} onPress={() => handleIncidenciaPress(incidencia)}>
                        <Text>{incidencia.nombre}</Text>
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
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        alignSelf: "flex-start", // Alineado a la izquierda
        marginLeft: 20, // Añadido margen izquierdo
    },
    scrollView: {
        alignItems: "center", // Alineado al centro
    },
    card: {
        width: "90%",
        backgroundColor: "#e0e0e0",
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#007bff", // Color de fondo del botón
        borderRadius: 25, // Borde redondeado
        paddingVertical: 15, // Espacio vertical interno
        paddingHorizontal: 25, // Espacio horizontal interno
    },
    addButtonText: {
        color: "#fff", // Color del texto
        fontSize: 18,
        fontWeight: "bold",
    },
});
