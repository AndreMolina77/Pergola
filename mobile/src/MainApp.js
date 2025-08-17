import { View, Text, Button, StyleSheet } from 'react-native';

const MainApp = () => {
    const handlePress = () => {
        alert('Prueba exitosa!');
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Prueba de MainApp</Text>
            <Button title="Presiona aquí" onPress={handlePress} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});
export default MainApp;