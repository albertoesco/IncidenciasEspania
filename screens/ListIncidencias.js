import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button } from "react-native";
import appFirebase from "../credenciales";
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
            <ScrollView style={styles.scrollView}>
                {incidencias.map((incidencia, index) => (
                    <TouchableOpacity key={index} onPress={() => handleIncidenciaPress(incidencia)}>
                        <Text>{incidencia.nombre}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.addButtonContainer}>
                <Button title="Nueva Incidencia" onPress={handleNewIncidencia} />
            </View>
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
    addButtonContainer: {
        position: "absolute",
        bottom: 20,
        right: 20,
    },
});
