import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import appFirebase from "../credenciales";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function ListIncidencias({ route, navigation }) {
    const { nombreComunidad, nombreProvincia } = route.params;
    const [incidencias, setIncidencias] = useState([]);

    
    useEffect(() => {
        console.log("nombreProvincia:", nombreProvincia);
        const getIncidencias = async () => {
            try {
                // Consultar las incidencias de la provincia por su nombre
                const incidenciasRef = collection(db, "comunidades", nombreComunidad, "provincias", nombreProvincia, "incidencias");
                const incidenciasSnapshot = await getDocs(incidenciasRef);
                const incidenciasData = [];
                incidenciasSnapshot.forEach((doc) => {
                    incidenciasData.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setIncidencias(incidenciasData);
                console.log("Incidencias obtenidas:", incidenciasData); // Log para mostrar las incidencias obtenidas
            } catch (error) {
                console.error("Error fetching incidencias: ", error);
            }
        };
    
        getIncidencias();
    }, [nombreProvincia, nombreComunidad]);
    

    const handleIncidenciaPress = (nombreIncidencia) => {
        // Aquí puedes manejar el evento de presionar una incidencia
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Incidencias de {nombreProvincia}</Text>
            <ScrollView style={styles.scrollView}>
                {incidencias.map((incidencia, index) => (
                    <TouchableOpacity key={index} onPress={() => handleIncidenciaPress(incidencia.nombre)}>
                        <Text>{incidencia.nombre}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    scrollView: {
        width: "100%",
    },
});
