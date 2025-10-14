import { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { useFonts } from 'expo-font';
import { formatPrice } from '../catalog/productUtils';

const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const CheckoutScreen = ({ navigation }) => {
  const { user, API, fetchWithAuth } = useContext(AuthContext);
  const { cart, cartTotal, cartSubtotal, clearCart } = useContext(CartContext);

  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    receiver: '',
    timetable: '',
    mailingAddress: '',
    paymentMethod: 'efectivo',
    deliveryDate: ''
  });

  const [errors, setErrors] = useState({});

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../../assets/fonts/Quicksand-Medium.ttf'),
    'Nunito-Bold': require('../../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    try {
      const response = await fetchWithAuth(`${API}/customers/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCustomerData(data);
        
        setFormData(prev => ({
          ...prev,
          receiver: `${data.name} ${data.lastName}`,
          mailingAddress: data.address || '',
        }));
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (text) => {
    const prefix = "+503-";
    let numbers = text.replace(/\D/g, '');
    
    if (!text.startsWith(prefix)) {
      numbers = numbers.slice(3);
    }
    
    numbers = numbers.slice(0, 8);
    return prefix + numbers;
  };

  const formatDate = (text) => {
    let numbers = text.replace(/\D/g, '');
    numbers = numbers.slice(0, 8);
    
    if (numbers.length >= 5) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4);
    } else if (numbers.length >= 3) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    return numbers;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.receiver.trim() || formData.receiver.trim().length < 5) {
      newErrors.receiver = 'El nombre del receptor debe tener al menos 5 caracteres';
    }

    if (formData.receiver.trim().length > 100) {
      newErrors.receiver = 'El nombre no puede exceder los 100 caracteres';
    }

    if (!formData.mailingAddress.trim() || formData.mailingAddress.trim().length < 10) {
      newErrors.mailingAddress = 'La dirección debe tener al menos 10 caracteres';
    }

    if (formData.mailingAddress.trim().length > 200) {
      newErrors.mailingAddress = 'La dirección no puede exceder los 200 caracteres';
    }

    if (formData.timetable && formData.timetable.trim().length > 100) {
      newErrors.timetable = 'El horario no puede exceder los 100 caracteres';
    }

    if (!['efectivo', 'tarjeta de crédito', 'transferencia', 'paypal', 'otro'].includes(formData.paymentMethod)) {
      newErrors.paymentMethod = 'Método de pago no válido';
    }

    if (formData.deliveryDate) {
      const [day, month, year] = formData.deliveryDate.split('/');
      if (day && month && year && year.length === 4) {
        const selectedDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          newErrors.deliveryDate = 'La fecha de entrega debe ser futura';
        }
      } else if (formData.deliveryDate.trim() !== '') {
        newErrors.deliveryDate = 'Formato de fecha inválido (DD/MM/AAAA)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      Alert.alert('Errores en el formulario', 'Por favor corrige los errores antes de continuar');
      return;
    }

    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'No hay productos en el carrito');
      return;
    }

    Alert.alert(
      'Confirmar pedido',
      `Total a pagar: ${formatPrice(cartTotal)}\n¿Deseas confirmar este pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: submitOrder }
      ]
    );
  };

  const submitOrder = async () => {
    setSubmitting(true);
    
    try {
      const orderCode = generateOrderCode();
      
      const items = cart.map(item => ({
        itemId: item._id,
        quantity: item.quantity,
        price: item.discount > 0 ? item.price * (1 - item.discount) : item.price
      }));

      let deliveryDateISO = null;
      if (formData.deliveryDate && formData.deliveryDate.trim()) {
        const [day, month, year] = formData.deliveryDate.split('/');
        if (day && month && year) {
          deliveryDateISO = new Date(year, month - 1, day).toISOString();
        }
      }

      const orderData = {
        orderCode,
        customer: user.id,
        receiver: formData.receiver.trim(),
        timetable: formData.timetable.trim() || undefined,
        mailingAddress: formData.mailingAddress.trim(),
        paymentMethod: formData.paymentMethod,
        status: 'pendiente',
        paymentStatus: 'pendiente',
        deliveryDate: deliveryDateISO,
        items,
        subtotal: cartSubtotal,
        total: cartTotal
      };

      const response = await fetchWithAuth(`${API}/public/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        
        await clearCart();
        
        Alert.alert(
          'Pedido realizado',
          `Tu pedido ${orderCode} ha sido creado exitosamente`,
          [
            {
              text: 'Ver mis pedidos',
              onPress: () => navigation.navigate('Profile')
            }
          ]
        );
        
        navigation.navigate('OrderSuccess', { 
          orderId: result.data._id,
          orderCode: orderCode 
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el pedido');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      Alert.alert('Error', error.message || 'No se pudo procesar el pedido');
    } finally {
      setSubmitting(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#3D1609" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Finalizar Compra</Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Entrega</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre del Receptor *</Text>
            <TextInput
              style={[styles.input, errors.receiver && styles.inputError]}
              value={formData.receiver}
              onChangeText={(text) => setFormData(prev => ({ ...prev, receiver: text }))}
              placeholder="Nombre completo de quien recibe"
              maxLength={100}
            />
            {errors.receiver && (
              <Text style={styles.errorText}>{errors.receiver}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dirección de Envío *</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.mailingAddress && styles.inputError]}
              value={formData.mailingAddress}
              onChangeText={(text) => setFormData(prev => ({ ...prev, mailingAddress: text }))}
              placeholder="Dirección completa de entrega"
              multiline
              numberOfLines={3}
              maxLength={200}
            />
            {errors.mailingAddress && (
              <Text style={styles.errorText}>{errors.mailingAddress}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Horario de Entrega (opcional)</Text>
            <TextInput
              style={[styles.input, errors.timetable && styles.inputError]}
              value={formData.timetable}
              onChangeText={(text) => setFormData(prev => ({ ...prev, timetable: text }))}
              placeholder="Ej: 9:00 AM - 5:00 PM"
              maxLength={100}
            />
            {errors.timetable && (
              <Text style={styles.errorText}>{errors.timetable}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Fecha de Entrega Deseada (opcional)</Text>
            <TextInput
              style={[styles.input, errors.deliveryDate && styles.inputError]}
              value={formData.deliveryDate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, deliveryDate: formatDate(text) }))}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />
            {errors.deliveryDate && (
              <Text style={styles.errorText}>{errors.deliveryDate}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Pago</Text>
          
          {['efectivo', 'tarjeta de crédito', 'transferencia', 'paypal', 'otro'].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentOption,
                formData.paymentMethod === method && styles.paymentOptionActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
            >
              <View style={[
                styles.radio,
                formData.paymentMethod === method && styles.radioActive
              ]}>
                {formData.paymentMethod === method && (
                  <View style={styles.radioDot} />
                )}
              </View>
              <Text style={[
                styles.paymentOptionText,
                formData.paymentMethod === method && styles.paymentOptionTextActive
              ]}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
          
          <View style={styles.summaryCard}>
            {cart.map((item) => {
              const itemPrice = item.discount > 0 
                ? item.price * (1 - item.discount) 
                : item.price;
              const itemTotal = itemPrice * item.quantity;
              
              return (
                <View key={item._id} style={styles.summaryItem}>
                  <View style={styles.summaryItemInfo}>
                    <Text style={styles.summaryItemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.summaryItemQuantity}>
                      x{item.quantity}
                    </Text>
                  </View>
                  <Text style={styles.summaryItemPrice}>
                    {formatPrice(itemTotal)}
                  </Text>
                </View>
              );
            })}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(cartSubtotal)}
              </Text>
            </View>

            {cartSubtotal !== cartTotal && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.discountLabel]}>
                  Descuentos:
                </Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -{formatPrice(cartSubtotal - cartTotal)}
                </Text>
              </View>
            )}

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                {formatPrice(cartTotal)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerInfo}>
            <Text style={styles.footerLabel}>Total a pagar</Text>
            <Text style={styles.footerTotal}>{formatPrice(cartTotal)}</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmitOrder}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Confirmar Pedido</Text>
                <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: statusBarHeight + 10,
    paddingBottom: 16,
    backgroundColor: '#E3C6B8',
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#3D1609',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    borderWidth: 1,
    borderColor: '#E8D5C9',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#F44336',
    marginTop: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentOptionActive: {
    backgroundColor: '#FFF5F0',
    borderColor: '#A73249',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#A73249',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A73249',
  },
  paymentOptionText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
  },
  paymentOptionTextActive: {
    color: '#A73249',
    fontFamily: 'Nunito-Bold',
  },
  summaryCard: {
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    padding: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryItemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryItemName: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    flex: 1,
  },
  summaryItemQuantity: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
    marginLeft: 8,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8D5C9',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
  },
  discountLabel: {
    color: '#4CAF50',
  },
  discountValue: {
    color: '#4CAF50',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8D5C9',
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
  },
  totalValue: {
    fontSize: 22,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8D5C9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerInfo: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  footerTotal: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  submitButton: {
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
});

export default CheckoutScreen;