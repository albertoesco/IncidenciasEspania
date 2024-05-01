import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function ListProvincias({ route }) {
    const { comunidadId } = route.params;


    // Aquí puedes utilizar el ID de la comunidad para obtener las provincias correspondientes
    // a través de consultas a tu base de datos
    return (
        <View style={styles.container}>
            <Text>Provincias de la comunidad con ID: {comunidadId}</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
