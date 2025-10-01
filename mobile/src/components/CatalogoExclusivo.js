import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CatalogoExclusivo = () => {
  // Ejemplo de catálogo
  const catalogos = [
    { id: 1, nombre: 'Catálogo Pulseras' },
    { id: 2, nombre: 'Catálogo Aretes' },
    { id: 3, nombre: 'Catálogo Cadenas' },
    { id: 4, nombre: 'Catálogo Anillos' },
    { id: 5, nombre: 'Catálogo Tobilleras' },
    { id: 6, nombre: 'Catálogo Juegos completos' },
  ];

  return (
    <View style={styles.container}>
      {catalogos.map((cat) => (
        <View key={cat.id} style={styles.item}>
          <Text style={styles.text}>{cat.nombre}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 5,
    elevation: 2,
    minWidth: '45%',
  },
  text: {
    fontSize: 13,
    color: '#3d1609',
    fontWeight: '600',
  },
});

export default CatalogoExclusivo;
