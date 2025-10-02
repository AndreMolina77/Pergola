import { useState, useContext, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, useWindowDimensions, Alert, Animated, TouchableWithoutFeedback } from 'react-native';
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
  // Load fonts from the local assets directory
  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Bold': require('../../assets/fonts/CormorantGaramond-Bold.ttf'),
    'Nunito-Black': require('../../assets/fonts/Nunito-Black.ttf'),
    'Quicksand': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-BoldItalic': require('../../assets/fonts/Quicksand-BoldItalic.ttf'),
  });
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const navigation = useNavigation();
  const { user, authToken } = useContext(AuthContext);
  const greeting = user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Hola, \nusuario';

  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

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

  const dropdownHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 45], // Altura para 1 item
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Mostrar un indicador de carga hasta que las fuentes estén disponibles
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#e3c6b8" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greetingText}>{greeting}</Text>
        
        {/* Dropdown Container */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity  
            onPress={toggleDropdown} 
            style={[
              styles.dropdownButton,
              menuOpen && styles.dropdownButtonOpen
            ]}
          >
            <Text style={styles.dropdownButtonText}>Explorar productos</Text>
            <Icon 
              name={menuOpen ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#3d1609" 
              style={styles.dropdownIcon}
            />
          </TouchableOpacity>

          {menuOpen && (
            <Animated.View 
              style={[
                styles.dropdownContent,
                {
                  height: dropdownHeight,
                  opacity: opacity,
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => {
                  setMenuOpen(false);
                  if (!authToken) {
                    Alert.alert(
                      "Acceso restringido", 
                      "Debes iniciar sesión para realizar esta encuesta.",
                      [
                        { 
                          text: "Iniciar sesión", 
                          onPress: () => navigation.navigate('Login') 
                        },
                        { 
                          text: "Cancelar", 
                          style: "cancel" 
                        }
                      ]
                    );
                  } else {
                    navigation.navigate('Survey');
                  }
                }}
              >
                <Text style={styles.itemText}>Realizar Encuesta</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <View>
          <TouchableOpacity onPress={() => { Alert.alert('Notificaciones', 'No hay notificaciones nuevas.'); }}>
            <Icon name="notifications" size={32} style={styles.notiIcon} />
          </TouchableOpacity>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => setSearchModalVisible(true)}
        >
          <Icon name="search" size={20} style={styles.searchIcon}/>
          <Text style={styles.searchPlaceholder}>Buscar</Text>
        </TouchableOpacity>

        {/* Sección A: Creaciones Pérgola */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Creaciones Pérgola</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <ColeccionesPergola />
        </View>

        {/* Sección B: Selección Exclusiva */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Selección Exclusiva</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <CatalogoExclusivo />
        </View>

        {/* Sección C: Espacio Promocional para Diseños Únicos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Diseños Únicos</Text>
          </View>
          <View style={styles.promocionalContainer}>
            <Text style={styles.promocionalText}>
              ¡Crea tu diseño personalizado en 4 sencillos pasos!
            </Text>
            <TouchableOpacity
              style={styles.promocionalButton}
              onPress={() => {
                // Navega a la pantalla de diseño personalizado
                navigation.navigate('CustomDesign')
              }}
            >
              <Text style={styles.promocionalButtonText}>Comenzar diseño único</Text>
            </TouchableOpacity>
            <View style={styles.pasosContainer}>
              <Text style={styles.paso}>Paso 1: Elige la pieza</Text>
              <Text style={styles.paso}>Paso 2: Elige la base</Text>
              <Text style={styles.paso}>Paso 3: Elige la decoración</Text>
              <Text style={styles.paso}>Paso 4: Elige el cierre</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Search Modal */}
      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3c6b8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#e3c6b8',
    position: 'relative',
    zIndex: 100,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e1d8',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  dropdownButtonOpen: {
    borderBottomLeftRadius: 0, // CAMBIAR a 0
    borderBottomRightRadius: 0, // CAMBIAR a 0
    borderBottomWidth: 0,
  },
  dropdownButtonText: {
    fontSize: 14,
    fontFamily: "Quicksand-Bold",
    fontWeight: '600',
    color: '#3d1609',
    marginRight: 4,
  },
  dropdownIcon: {
    marginLeft: 2,
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#e8e1d8',
    borderBottomLeftRadius: 20, // AÑADIR
    borderBottomRightRadius: 20, // AÑADIR
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e8e1d8'
  },
  itemText: {
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: '#3d1609',
  },
  greetingText: {
    fontSize: 16,
    fontFamily: 'Nunito-Black',
    color: '#3d1609',
    maxWidth: 100, // LIMITAR ancho máximo
    numberOfLines: 1, // LIMITAR a una línea
  },
  cartBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4757',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontFamily: "Quicksand-Bold",
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
    color: "#3d1609"
  },
  notiIcon: {
    color: "#3d1609"
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  searchPlaceholder: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#3d1609',
    lineHeight: 45,
    textAlignVertical: 'center',
    fontFamily: "Quicksand-Bold",
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: '#3d1609',
  },
  seeAll: {
    fontFamily: "Quicksand",
    fontSize: 14,
    color: '#3d1609',
    textDecorationLine: 'underline',
  },
  horizontalScroll: {
    marginHorizontal: -5,
  },
  creacionItem: {
    alignItems: 'center',
    marginHorizontal: 15,
    width: 80,
  },
  creacionImage: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  creacionIcon: {
    fontSize: 24,
  },
  creacionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
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
    position: 'relative',
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  exclusivaImage: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  exclusivaEmoji: {
    fontSize: 40,
  },
  exclusivaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  exclusivaPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4757',
  },
  promocionalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  promocionalText: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: '#a73249',
    marginBottom: 10,
    textAlign: 'center',
  },
  promocionalButton: {
    backgroundColor: '#a73249',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  promocionalButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: "Quicksand-Bold",
  },
  pasosContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  paso: {
    fontSize: 13,
    color: '#3d1609',
    marginBottom: 4,
    fontFamily: "Quicksand-Bold",
  },
});

export default HomeScreen;