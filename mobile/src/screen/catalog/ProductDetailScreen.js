import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import ProductImageGallery from './ProductImageGallery';
import ReviewsSection from './ReviewsSection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { getProductPricing, getProductStatus, formatPrice, getProductCategoryInfo, sanitizeProduct } from '../../screen/catalog/productUtils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { user, API } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [wishlist, setWishlist] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    loadProduct();
    if (user) {
      loadWishlist();
    }
  }, [productId, user]);

  useEffect(() => {
    if (product && wishlist.length >= 0) {
      setIsInWishlist(wishlist.some(item => item._id === product._id));
    }
  }, [product, wishlist]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/public/products`);
      if (response.ok) {
        const products = await response.json();
        const foundProduct = products.find(p => p._id === productId);
        if (foundProduct) {
          // Sanitizar producto para evitar errores de referencias undefined
          const sanitizedProduct = sanitizeProduct(foundProduct);
          setProduct(sanitizedProduct);
        } else {
          Alert.alert('Error', 'Producto no encontrado');
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const stored = await AsyncStorage.getItem(`wishlist_${user.id}`);
      setWishlist(stored ? JSON.parse(stored) : []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para guardar productos en tu lista de deseos');
      return;
    }

    try {
      let newWishlist;
      
      if (isInWishlist) {
        newWishlist = wishlist.filter(item => item._id !== product._id);
      } else {
        newWishlist = [...wishlist, {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          discount: product.discount
        }];
      }

      setWishlist(newWishlist);
      setIsInWishlist(!isInWishlist);
      await AsyncStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newWishlist));
    } catch (error) {
      console.error('Error updating wishlist:', error);
      Alert.alert('Error', 'No se pudo actualizar la lista de deseos');
    }
  };

  const addToCart = () => {
    if (!user) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    const statusInfo = getProductStatus(product);
    
    if (!statusInfo.available) {
      Alert.alert('Producto no disponible', 'Este producto no está disponible actualmente');
      return;
    }

    if (cartQuantity > product.stock) {
      Alert.alert('Stock insuficiente', `Solo hay ${product.stock} unidades disponibles`);
      return;
    }

    // Aquí implementarías la lógica del carrito
    Alert.alert('Producto agregado', `${cartQuantity} ${cartQuantity === 1 ? 'unidad agregada' : 'unidades agregadas'} al carrito`);
  };

  const calculateDiscountedPrice = () => {
    if (product?.discount && product.discount > 0) {
      return product.price * (1 - product.discount);
    }
    return product?.price || 0;
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible':
        return '#4CAF50';
      case 'agotado':
        return '#F44336';
      case 'en producción':
        return '#FF9800';
      case 'descontinuado':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'agotado':
        return 'Agotado';
      case 'en producción':
        return 'En producción';
      case 'descontinuado':
        return 'Descontinuado';
      default:
        return 'Sin estado';
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'details') {
      return (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          {/* Información básica */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Información de categorías */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorización</Text>
            <View style={styles.categoryInfo}>
              {(() => {
                const categoryInfo = getProductCategoryInfo(product);
                return (
                  <>
                    <View style={styles.categoryRow}>
                      <Text style={styles.categoryLabel}>Colección:</Text>
                      <Text style={styles.categoryValue}>{categoryInfo.collection.name}</Text>
                    </View>
                    <View style={styles.categoryRow}>
                      <Text style={styles.categoryLabel}>Categoría:</Text>
                      <Text style={styles.categoryValue}>{categoryInfo.category.name}</Text>
                    </View>
                    <View style={styles.categoryRow}>
                      <Text style={styles.categoryLabel}>Subcategoría:</Text>
                      <Text style={styles.categoryValue}>{categoryInfo.subcategory.name}</Text>
                    </View>
                  </>
                );
              })()}
            </View>
          </View>

          {/* Información de stock y estado */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disponibilidad</Text>
            <View style={styles.stockInfo}>
              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>Stock disponible:</Text>
                <Text style={styles.stockValue}>{product.stock} unidades</Text>
              </View>
              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>Estado:</Text>
                {(() => {
                  const statusInfo = getProductStatus(product);
                  return (
                    <View style={styles.statusContainer}>
                      <View style={[
                        styles.statusIndicator,
                        { backgroundColor: statusInfo.color }
                      ]} />
                      <Text style={styles.statusText}>{statusInfo.displayText}</Text>
                    </View>
                  );
                })()}
              </View>
              {product.highlighted && (
                <View style={styles.highlightedBadge}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.highlightedText}>Producto destacado</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      );
    } else {
      return <ReviewsSection productId={productId} />;
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pricing = getProductPricing(product);
  const statusInfo = getProductStatus(product);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#3D1609" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.wishlistButton}
          onPress={toggleWishlist}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isInWishlist ? "heart" : "heart-outline"}
            size={24}
            color={isInWishlist ? "#A73249" : "#3D1609"}
          />
        </TouchableOpacity>
      </View>

      {/* Galería de imágenes */}
      <ProductImageGallery images={product.images} />

      {/* Información del producto */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        
        <View style={styles.priceContainer}>
          {pricing.hasDiscount ? (
            <>
              <Text style={styles.originalPrice}>{formatPrice(pricing.originalPrice)}</Text>
              <Text style={styles.discountedPrice}>{formatPrice(pricing.finalPrice)}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  -{pricing.discountPercentage}%
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.price}>{formatPrice(pricing.finalPrice)}</Text>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'details' && styles.activeTab]}
          onPress={() => setActiveTab('details')}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'details' && styles.activeTabText
          ]}>Detalles</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'reviews' && styles.activeTabText
          ]}>Reseñas</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido de las tabs */}
      <View style={styles.tabContentContainer}>
        {renderTabContent()}
      </View>

      {/* Footer con botón de agregar al carrito */}
      {activeTab === 'details' && (
        <View style={styles.footer}>
          {product.status === 'disponible' && product.stock > 0 ? (
            <View style={styles.addToCartContainer}>
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={20} color="#A73249" />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{cartQuantity}</Text>
                
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => setCartQuantity(Math.min(product.stock, cartQuantity + 1))}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color="#A73249" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.addToCartBtn}
                onPress={addToCart}
                activeOpacity={0.8}
              >
                <Ionicons name="bag-add" size={20} color="#FFFFFF" />
                <Text style={styles.addToCartText}>Agregar al carrito</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.unavailableContainer}>
              <Text style={styles.unavailableText}>Producto no disponible</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3C6B8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3C6B8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3C6B8',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#A73249',
    marginBottom: 20,
    textAlign: 'center',
  },
  goBackBtn: {
    backgroundColor: '#A73249',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  goBackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: statusBarHeight + 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(227, 198, 184, 0.95)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  wishlistButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  productInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  productName: {
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 12,
    lineHeight: 28,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  originalPrice: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  discountBadge: {
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E1D8',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#A73249',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
  },
  activeTabText: {
    color: '#A73249',
    fontFamily: 'Nunito-Bold',
  },
  tabContentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    lineHeight: 20,
  },
  categoryInfo: {
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
  },
  categoryValue: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    flex: 1,
    textAlign: 'right',
  },
  stockInfo: {
    gap: 8,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
  },
  stockValue: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
  },
  highlightedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  highlightedText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
    color: '#F57C00',
    marginLeft: 4,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E1D8',
    padding: 16,
  },
  addToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE8',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  quantityBtn: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  unavailableContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  unavailableText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#999999',
  },
});

export default ProductDetailScreen;
