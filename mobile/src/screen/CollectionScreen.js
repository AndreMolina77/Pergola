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

// Mock data para colecciones
const MOCK_COLLECTIONS = [
  {
    _id: '1',
    name: 'Colección Primavera',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    description: 'Una colección inspirada en la renovación y frescura de la primavera. Piezas únicas que capturan la esencia de la naturaleza en flor.'
  },
  {
    _id: '2', 
    name: 'Esencia Bohemia',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400',
    description: 'Joyas con espíritu libre y despreocupado. Diseños orgánicos que reflejan la belleza natural y la autenticidad.'
  },
  {
    _id: '3',
    name: 'Clásicos Eternos',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
    description: 'Piezas atemporales que trascienden las tendencias. Elegancia y sofisticación en cada diseño.'
  },
  {
    _id: '4',
    name: 'Modern Luxe',
    image: 'https://images.unsplash.com/photo-1588444650700-6c7f0c89d36b?w=400',
    description: 'Donde lo contemporáneo se encuentra con el lujo. Diseños vanguardistas para el estilo de vida moderno.'
  }
];

const CollectionDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { collectionId, collectionName, collectionImage } = route.params;
  
  const [collection, setCollection] = useState(null);
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
    const loadCollectionData = () => {
      setLoading(true);
      
      // Simular delay de API
      setTimeout(() => {
        const foundCollection = MOCK_COLLECTIONS.find(col => col._id === collectionId);
        
        if (foundCollection) {
          setCollection(foundCollection);
        } else {
          // Si no encuentra en mock, crear objeto con datos básicos
          setCollection({
            _id: collectionId,
            name: collectionName,
            image: collectionImage,
            description: 'Una exclusiva colección de joyas cuidadosamente diseñadas para realzar tu estilo único y elegancia natural.'
          });
        }
        
        setLoading(false);
      }, 800);
    };

    loadCollectionData();
  }, [collectionId, collectionName, collectionImage]);

  const handleBack = () => {
    navigation.goBack();
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
          <Text style={styles.loadingText}>Cargando colección...</Text>
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
        <Text style={styles.headerTitle}>Colección</Text>
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
            {collection?.image ? (
              <Image 
                source={{ uri: collection.image }} 
                style={styles.collectionImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="images-outline" size={50} color="#E8E1D8" />
                <Text style={styles.placeholderText}>Sin imagen</Text>
              </View>
            )}
          </View>
          
          <View style={styles.collectionInfo}>
            <Text style={styles.collectionName}>
              {collection?.name}
            </Text>
            
            {collection?.description && (
              <Text style={styles.collectionDescription}>
                {collection.description}
              </Text>
            )}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Características</Text>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="diamond-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Material Premium</Text>
              <Text style={styles.featureDescription}>
                Joyas elaboradas con materiales de la más alta calidad
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="hand-left-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Hecho a Mano</Text>
              <Text style={styles.featureDescription}>
                Cada pieza es cuidadosamente elaborada por artesanos expertos
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="sparkles-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Diseño Exclusivo</Text>
              <Text style={styles.featureDescription}>
                Piezas únicas que reflejan tu estilo personal
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="leaf-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Sostenible</Text>
              <Text style={styles.featureDescription}>
                Comprometidos con prácticas responsables y eco-amigables
              </Text>
            </View>
          </View>
        </View>

        {/* Coming Soon Section */}
        <View style={styles.comingSoonSection}>
          <View style={styles.comingSoonCard}>
            <Ionicons name="time-outline" size={40} color="#3D1609" />
            <Text style={styles.comingSoonTitle}>Próximamente</Text>
            <Text style={styles.comingSoonDescription}>
              Estamos preparando los productos exclusivos de esta colección. 
              Muy pronto podrás descubrir todas las piezas únicas que tenemos para ti.
            </Text>
            <TouchableOpacity style={styles.notifyButton}>
              <Text style={styles.notifyButtonText}>Notificarme</Text>
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
  collectionImage: {
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
  collectionInfo: {
    paddingHorizontal: 4,
  },
  collectionName: {
    fontFamily: 'CormorantGaramond-Bold',
    fontSize: 28,
    color: '#3D1609',
    marginBottom: 12,
    textAlign: 'center',
  },
  collectionDescription: {
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
  comingSoonSection: {
    paddingHorizontal: 16,
  },
  comingSoonCard: {
    backgroundColor: '#F5EDE8',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8D5C9',
  },
  comingSoonTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    color: '#3D1609',
    marginTop: 12,
    marginBottom: 8,
  },
  comingSoonDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#3D1609',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 20,
  },
  notifyButton: {
    backgroundColor: '#A73249',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  notifyButtonText: {
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default CollectionDetailScreen;