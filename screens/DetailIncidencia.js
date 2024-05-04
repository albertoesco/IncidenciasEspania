import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DetailIncidencia({ route }) {
  const { incidencia } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{incidencia.nombre}</Text>
      <Text>Descripción: {incidencia.descripcion}</Text>
      <Text>Fecha: {incidencia.fecha}</Text>
      <Text>Estado: {incidencia.estado}</Text>
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
});
