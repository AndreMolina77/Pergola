import { useState, useContext, useRef } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  SafeAreaView, StatusBar, useWindowDimensions, Alert, Animated 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { useNavigation } from '@react-navigation/native';

import SearchModal from '../components/SearchModal.js';
import ColeccionesPergola from '../components/ColeccionesPergola.js';
import CatalogoExclusivo from '../components/CatalogoExclusivo.js';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  // Cargar fuentes personalizadas
  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Bold': require('../../assets/fonts/CormorantGaramond-Bold.ttf'),
    'Nunito-Black': require('../../assets/fonts/Nunito-Black.ttf'),
    'Quicksand': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-BoldItalic': require('../../assets/fonts/Quicksand-BoldItalic.ttf'),
  });

  // Estados principales
  const [searchModalVisible, setSearchModalVisible] = useState(false); // controlar modal de búsqueda
  const [menuOpen, setMenuOpen] = useState(false); // controlar dropdown
  const [animation] = useState(new Animated.Value(0)); // animación dropdown

  const navigation = useNavigation();
  const { user, authToken } = useContext(AuthContext);

  // Saludo dinámico
  const greeting = user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Hola, \nusuario';

  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  // Animar abrir/cerrar dropdown
  const toggleDropdown = () => {
    if (menuOpen) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  // Interpolaciones de animación
  const dropdownHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 45],
  });
  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!fontsLoaded) return <AppLoading />; // Esperar fuentes cargadas

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#e3c6b8" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        {/* Texto saludo */}
        <Text style={styles.greetingText}>{greeting}</Text>
        
        {/* Botón Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity  
            onPress={toggleDropdown} 
            style={[styles.dropdownButton, menuOpen && styles.dropdownButtonOpen]}
          >
            <Text style={styles.dropdownButtonText}>Explorar productos</Text>
            <Icon name={menuOpen ? "chevron-up" : "chevron-down"} size={16} color="#3d1609" />
          </TouchableOpacity>

          {/* Contenido Dropdown */}
          {menuOpen && (
            <Animated.View style={[styles.dropdownContent,{ height: dropdownHeight, opacity }]}>
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => {
                  setMenuOpen(false);
                  if (!authToken) {
                    navigation.navigate('Login'); // si no hay token → login
                  } else {
                    Alert.alert('Encuesta', 'Funcionalidad próximamente.');
                  }
                }}
              >
                <Text style={styles.itemText}>Realizar Encuesta</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Icono de notificaciones */}
        <View>
          <TouchableOpacity onPress={() => Alert.alert('Notificaciones', 'No hay notificaciones nuevas.')}>
            <Icon name="notifications" size={32} style={styles.notiIcon} />
          </TouchableOpacity>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </View>
      </View>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Barra de búsqueda */}
        <TouchableOpacity style={styles.searchContainer} onPress={() => setSearchModalVisible(true)}>
          <Icon name="search" size={18} style={styles.searchIcon}/>
          <Text style={styles.searchPlaceholder}>Buscar</Text>
        </TouchableOpacity>

        {/* Sección: Creaciones pérgola */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Creaciones pérgola</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Ver todo</Text></TouchableOpacity>
          </View>
          <ColeccionesPergola />
        </View>

        {/* Sección: Selección exclusiva */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Selección exclusiva</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Ver todo</Text></TouchableOpacity>
          </View>
          <CatalogoExclusivo />
        </View>

        {/* Sección: Diseños únicos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Diseños únicos</Text>
            <Text style={styles.seeAll}>Empezar</Text>
          </View>
          <View style={styles.designCard}>
            <Text style={styles.designText}>Crea tu diseño personalizado en simples pasos!</Text>
            <Text style={styles.designStep}>• Elige la pieza</Text>
            <Text style={styles.designStep}>• Elige la base</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de búsqueda */}
      <SearchModal visible={searchModalVisible} onClose={() => setSearchModalVisible(false)} />
    </SafeAreaView>
  );
};

/* --- ESTILOS --- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e3c6b8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#e3c6b8' },
  greetingText: { fontSize: 16, fontFamily: 'Nunito-Black', color: '#3d1609', maxWidth: 100 },
  dropdownContainer: { position: 'relative' },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8e1d8', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16 },
  dropdownButtonOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  dropdownButtonText: { fontSize: 14, fontFamily: "Quicksand-Bold", color: '#3d1609', marginRight: 4 },
  dropdownContent: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#e8e1d8', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden', elevation: 5 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16 },
  itemText: { fontSize: 14, fontFamily: "Quicksand", color: '#3d1609' },
  notiIcon: { color: "#3d1609" },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#FF4757', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontFamily: "Quicksand-Bold", fontSize: 10, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 20 },
  contentContainer: { flexGrow: 1 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 20 },
  searchIcon: { marginRight: 8, color: "#a73249" },
  searchPlaceholder: { fontSize: 15, color: '#3d1609', fontFamily: "Quicksand-Bold" },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontFamily: "Quicksand-Bold", fontSize: 18, color: '#3d1609' },
  seeAll: { fontFamily: "Quicksand", fontSize: 14, color: '#a73249' },
  designCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 2 },
  designText: { fontSize: 15, fontFamily: "Quicksand-Bold", color: '#3d1609', marginBottom: 10, textAlign: 'center' },
  designStep: { fontSize: 14, color: '#3d1609', marginBottom: 4, fontFamily: "Quicksand" },
});

export default HomeScreen;
