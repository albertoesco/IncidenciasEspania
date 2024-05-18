import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DetailIncidencia({ route }) {
  const { incidencia } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{incidencia.nombre}</Text>
      <Text style={styles.text}>Descripción: {incidencia.descripcion}</Text>
      <Text style={styles.text}>Fecha: {incidencia.fecha}</Text>
      <Text style={styles.text}>Estado: {incidencia.estado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffc00", // Fondo amarillo dorado
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ad1519", // Texto rojo oscuro
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    color: "#ad1519", // Texto rojo oscuro
  },
});
