import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ColeccionesPergola = () => {
  // Ejemplo de colecciones
  const colecciones = [
    { id: 1, nombre: 'Colección Cristal Bohemio' },
    { id: 2, nombre: 'Colección Esencias Ligeras' },
    { id: 3, nombre: 'Colección Perlas Rococó' },
  ];

  return (
    <View style={styles.container}>
      {colecciones.map((col) => (
        <View key={col.id} style={styles.item}>
          <Text style={styles.text}>{col.nombre}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    elevation: 2,
  },
  text: {
    fontSize: 13,
    color: '#3d1609',
    fontWeight: '600',
  },
});

export default ColeccionesPergola;
