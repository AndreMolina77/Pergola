import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';

const CatalogoExclusivo = () => {
  const [colecciones, setColecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColecciones = async () => {
      try {
        const response = await fetch('https://pergola-production.up.railway.app/api/public/subcategories');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setColecciones(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColecciones();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3d1609" />
        <Text style={styles.loadingText}>Cargando catálogo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (colecciones.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No hay productos disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalScroll}
      contentContainerStyle={styles.scrollContent}
    >
      {colecciones.map((col) => (
        <View key={col._id || col.id} style={styles.exclusivaItem}>
          {col.image ? (
            <Image 
              source={{ uri: col.image }} 
              style={styles.exclusivaImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Sin imagen</Text>
            </View>
          )}
          <Text style={styles.exclusivaTitle}>{col.name}</Text>
          {col.price && (
            <Text style={styles.exclusivaPrice}>${col.price}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalScroll: {
    marginHorizontal: -5,
  },
  scrollContent: {
    paddingHorizontal: 5,
  },
  exclusivaItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 8,
    width: 140,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exclusivaImage: {
    height: 80,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  placeholderImage: {
    height: 80,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: '#666',
    fontFamily: "Quicksand",
  },
  exclusivaTitle: {
    fontSize: 14,
    fontFamily: "Quicksand-Bold",
    color: '#3d1609',
    marginBottom: 5,
  },
  exclusivaPrice: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: '#a73249',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#3d1609',
    fontFamily: "Quicksand",
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#FF4757',
    fontFamily: "Quicksand-Bold",
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#3d1609',
    fontFamily: "Quicksand",
    textAlign: 'center',
  },
});

export default CatalogoExclusivo;