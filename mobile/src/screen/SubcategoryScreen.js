import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

// Mock data para subcategorías
const MOCK_SUBCATEGORIES = [
  {
    _id: '1',
    name: 'Anillos de Compromiso',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
    description: 'Anillos que simbolizan amor eterno y compromiso. Diseños únicos para el momento más especial.'
  },
  {
    _id: '2',
    name: 'Collares Elegantes',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
    description: 'Collares que realzan tu elegancia natural. Piezas perfectas para cualquier ocasión.'
  },
  {
    _id: '3',
    name: 'Pulseras Artesanales',
    image: 'https://images.unsplash.com/photo-1588444650700-6c7f0c89d36b?w=400',
    description: 'Pulseras elaboradas a mano con atención a cada detalle. Estilo y artesanía en perfecta armonía.'
  },
  {
    _id: '4',
    name: 'Aretes Modernos',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400',
    description: 'Aretes contemporáneos que complementan tu estilo único. Diseños vanguardistas y atemporales.'
  }
];

const SubcategoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { itemId, itemName, itemImage } = route.params;
  
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Bold': require('../../assets/fonts/CormorantGaramond-Bold.ttf'),
    'Nunito-Black': require('../../assets/fonts/Nunito-Black.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
    'Quicksand': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
  });

  useEffect(() => {
    // Simular carga de datos
    const loadSubcategoryData = () => {
      setLoading(true);
      // Simular delay de API
      setTimeout(() => {
        const foundSubcategory = MOCK_SUBCATEGORIES.find(item => item._id === itemId);
        
        if (foundSubcategory) {
          setSubcategory(foundSubcategory);
        } else {
          // Si no encuentra en mock, crear objeto con datos básicos
          setSubcategory({
            _id: itemId,
            name: itemName,
            image: itemImage,
            description: 'Una exclusiva selección de joyas cuidadosamente diseñadas para realzar tu estilo único y elegancia natural.'
          });
        }
        
        setLoading(false);
      }, 800);
    };

    loadSubcategoryData();
  }, [itemId, itemName, itemImage]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleExploreProducts = () => {
    // Navegar a la pantalla de productos cuando esté disponible
    Alert.alert(
      'Próximamente',
      'La exploración de productos estará disponible muy pronto.',
      [{ text: 'Entendido' }]
    );
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#E3C6B8" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3D1609" />
          <Text style={styles.loadingText}>Cargando categoría...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#E3C6B8" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="chevron-back" size={26} color="#3D1609" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categoría</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.imageContainer}>
            {subcategory?.image ? (
              <Image 
                source={{ uri: subcategory.image }} 
                style={styles.subcategoryImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="images-outline" size={50} color="#E8E1D8" />
                <Text style={styles.placeholderText}>Sin imagen</Text>
              </View>
            )}
          </View>
          
          <View style={styles.subcategoryInfo}>
            <Text style={styles.subcategoryName}>
              {subcategory?.name}
            </Text>
            
            {subcategory?.description && (
              <Text style={styles.subcategoryDescription}>
                {subcategory.description}
              </Text>
            )}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Características de la Categoría</Text>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="sparkles-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Diseño Exclusivo</Text>
              <Text style={styles.featureDescription}>
                Cada pieza es única y refleja la más alta calidad en diseño
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="diamond-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Material Premium</Text>
              <Text style={styles.featureDescription}>
                Utilizamos solo los mejores materiales para garantizar durabilidad
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="color-palette-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Variedad de Estilos</Text>
              <Text style={styles.featureDescription}>
                Desde diseños clásicos hasta las últimas tendencias
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="heart-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Garantía de Calidad</Text>
              <Text style={styles.featureDescription}>
                Todas nuestras piezas cuentan con garantía y certificación
              </Text>
            </View>
          </View>
        </View>

        {/* Price Range Section */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Rango de Precios</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRange}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Desde</Text>
                <Text style={styles.priceValue}>$45</Text>
              </View>
              <View style={styles.priceSeparator}>
                <Ionicons name="remove-outline" size={20} color="#E8E1D8" />
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Hasta</Text>
                <Text style={styles.priceValue}>$280</Text>
              </View>
            </View>
            <Text style={styles.priceNote}>
              Precios varían según diseño, materiales y complejidad de la pieza
            </Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Ionicons name="search-outline" size={40} color="#3D1609" />
            <Text style={styles.ctaTitle}>Explora Nuestros Productos</Text>
            <Text style={styles.ctaDescription}>
              Descubre la completa colección de {subcategory?.name.toLowerCase()} 
              disponibles en nuestro catálogo. Encuentra la pieza perfecta para ti.
            </Text>
            <TouchableOpacity style={styles.ctaButton} onPress={handleExploreProducts}>
              <Text style={styles.ctaButtonText}>Ver Productos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3C6B8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 24,
    color: '#3D1609',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Quicksand',
    fontSize: 16,
    color: '#3D1609',
    marginTop: 12,
  },
  heroSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#3D1609',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  subcategoryImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5EDE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: 'Quicksand',
    color: '#E8E1D8',
    fontSize: 14,
    marginTop: 8,
  },
  subcategoryInfo: {
    paddingHorizontal: 4,
  },
  subcategoryName: {
    fontFamily: 'CormorantGaramond-Bold',
    fontSize: 28,
    color: '#3D1609',
    marginBottom: 12,
    textAlign: 'center',
  },
  subcategoryDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#3D1609',
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.9,
  },
  featuresSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    color: '#3D1609',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#3D1609',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5EDE8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#3D1609',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#3D1609',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 16,
  },
  priceSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  priceCard: {
    backgroundColor: '#F5EDE8',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8D5C9',
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceItem: {
    alignItems: 'center',
    flex: 1,
  },
  priceLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#3D1609',
    opacity: 0.8,
    marginBottom: 4,
  },
  priceValue: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 24,
    color: '#A73249',
  },
  priceSeparator: {
    paddingHorizontal: 20,
  },
  priceNote: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#3D1609',
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  ctaSection: {
    paddingHorizontal: 16,
  },
  ctaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#3D1609',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ctaTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    color: '#3D1609',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#3D1609',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#A73249',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#A73249',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SubcategoryDetailScreen;