const ordersController = {};
// Importo el modelo de pedidos
import Orders from "../models/Orders.js";
// Importo el modelo de productos
import Products from "../models/Products.js";
// Importo el modelo de clientes
import Customers from "../models/Customers.js";
// Función helper para validar
import { validateOrder } from "../validators/validator.js";

// CREATE (POST)
ordersController.postOrders = async (req, res) => {
  try {
    console.log('🔵 [POST ORDERS] Inicio de creación de pedido');
    console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
    
    const { orderCode, customer, receiver, timetable, mailingAddress, paymentMethod, status, paymentStatus, deliveryDate, items, subtotal, total } = req.body;
    
    // Log de items recibidos
    console.log('📋 Items recibidos:', JSON.stringify(items, null, 2));
    console.log('📊 Tipo de items:', Array.isArray(items) ? 'Array' : typeof items);
    console.log('📊 Cantidad de items:', items?.length);
    
    // Verificar si el código de pedido ya existe
    console.log('🔍 Verificando código de pedido:', orderCode);
    const existingOrder = await Orders.findOne({ orderCode });
    if (existingOrder) {
      console.log('❌ Código de pedido ya existe');
      return res.status(400).json({ message: "El código de pedido ya está en uso" });
    }
    
    // Verificar que items sea un array válido
    if (!Array.isArray(items) || items.length === 0) {
      console.log('❌ Items inválido o vacío');
      return res.status(400).json({ message: "Debe incluir al menos un producto en el pedido" });
    }
    
    // Extraer IDs de productos
    const productIds = items.map(item => {
      console.log('🔍 Procesando item:', JSON.stringify(item, null, 2));
      return item.itemId || item._id || item;
    });
    console.log('🔍 IDs de productos extraídos:', productIds);
    
    // Verificar que los productos existan
    console.log('🔍 Verificando existencia de productos...');
    const productsExist = await Products.countDocuments({ _id: { $in: productIds } });
    console.log(`✅ Productos encontrados: ${productsExist} de ${productIds.length}`);
    
    if (productsExist !== productIds.length) {
      console.log('❌ Uno o más productos no existen');
      return res.status(400).json({ message: "Uno o más productos no existen" });
    }
    
    // Verificar que el cliente existe
    console.log('🔍 Verificando cliente:', customer);
    const customerExists = await Customers.findById(customer);
    if (!customerExists) {
      console.log('❌ Cliente no encontrado');
      return res.status(400).json({ message: "El cliente no existe" });
    }
    console.log('✅ Cliente encontrado:', customerExists.name);
    
    // Procesar items para asegurar estructura correcta
    const processedItems = items.map(item => {
      const processed = {
        itemId: item.itemId || item._id || item,
        quantity: item.quantity || 1,
        price: item.price || 0
      };
      console.log('✨ Item procesado:', JSON.stringify(processed, null, 2));
      return processed;
    });
    
    console.log('📦 Items procesados finales:', JSON.stringify(processedItems, null, 2));
    
    // Crear objeto de pedido
    const orderData = {
      orderCode,
      customer,
      receiver,
      timetable,
      mailingAddress,
      paymentMethod,
      status: status || "pendiente",
      paymentStatus: paymentStatus || "pendiente",
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      items: processedItems,
      subtotal: Number(subtotal) || 0,
      total: Number(total) || 0
    };
    
    console.log('🎯 Datos finales del pedido:', JSON.stringify(orderData, null, 2));
    
    const newOrder = new Orders(orderData);
    
    // Guardar el pedido
    console.log('💾 Guardando pedido...');
    await newOrder.save();
    console.log('✅ Pedido guardado exitosamente:', newOrder._id);
    
    // ESTADO DE CREACIÓN
    res.status(201).json({ message: "Pedido creado con éxito", data: newOrder });
  } catch (error) {
    console.log('❌❌❌ ERROR EN POST ORDERS ❌❌❌');
    console.log('Error completo:', error);
    console.log('Mensaje:', error.message);
    console.log('Stack:', error.stack);
    if (error.errors) {
      console.log('Errores de validación:', JSON.stringify(error.errors, null, 2));
    }
    // ESTADO DE ERROR EN INPUT DEL CLIENTE
    res.status(400).json({ 
      message: "Error al crear pedido", 
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : []
    });
  }
};

// READ (GET ALL)
ordersController.getOrders = async (req, res) => {
  try {
    // Buscar pedidos
    const orders = await Orders.find().populate('customer', 'username email phoneNumber').populate({path: "items.itemId", select: "name price images" });
    // ESTADO DE OK
    res.status(200).json(orders);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener ordenes", error: error.message });
  };
};

// READ (GET ALL PUBLIC ORDERS)
ordersController.getPublicOrders = async (req, res) => {
  try {
    // Buscar pedidos publicos
    const publicOrders = await Orders.find().populate('customer', 'username email phoneNumber').populate({path: "items.itemId", select: "name price images" });
    // ESTADO DE OK
    res.status(200).json(publicOrders);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener ordenes publicas", error: error.message });
  }
};

// READ (GET ONE BY ID)
ordersController.getOrder = async (req, res) => {
  try {
    // Buscar un solo pedido
    const order = await Orders.findById(req.params.id).populate('customer', 'username email phoneNumber').populate({path: "items.itemId", select: "name price images" });
    // Validar que el pedido si exista
    if (!order) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    // ESTADO DE OK
    res.status(200).json(order);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener pedido", error: error.message });
  }
};

// UPDATE (PUT)
ordersController.putOrders = async (req, res) => {
  try {
    console.log('🔵 [PUT ORDERS] Inicio de actualización de pedido');
    console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
    console.log('🆔 ID del pedido:', req.params.id);
    
    const updates = req.body;
    
    // Verificar si se intenta cambiar el código de pedido
    if (updates.orderCode) {
      const existingOrder = await Orders.findOne({ orderCode: updates.orderCode, _id: { $ne: req.params.id } /* Excluir el documento actual */ });
      // Si ya existe, devolver error
      if (existingOrder) {
        console.log('❌ Código de pedido ya existe');
        return res.status(400).json({ message: "El código de pedido ya está en uso" });
      }
    }
    
    // Verificar cliente si se actualiza
    if (updates.customer) {
      const existingCustomer = await Customers.findById(updates.customer);
      // Si no existe, devolver error
      if (!existingCustomer) {
        console.log('❌ Cliente no existe');
        return res.status(400).json({ message: "El cliente no existe" });
      }
    }
    
    // Verificar productos si se actualizan
    if (updates.items) {
      console.log('📋 Items a actualizar:', JSON.stringify(updates.items, null, 2));
      
      // Extraer solo los itemIds para la verificación
      const itemIds = updates.items.map(item => item.itemId || item);
      console.log('🔍 IDs de productos:', itemIds);
      
      const productsExist = await Products.countDocuments({ _id: { $in: itemIds } });
      console.log(`✅ Productos encontrados: ${productsExist} de ${itemIds.length}`);
      
      // Si no existen, devolver error
      if (productsExist !== itemIds.length) {
        console.log('❌ Uno o más productos no existen');
        return res.status(400).json({ message: "Uno o más productos no existen" });
      }
      
      // Procesar items para asegurar estructura correcta
      updates.items = updates.items.map(item => ({
        itemId: item.itemId || item._id || item,
        quantity: item.quantity || 1,
        price: item.price || 0
      }));
      console.log('✨ Items procesados:', JSON.stringify(updates.items, null, 2));
    }
    
    // Actualizar el pedido
    console.log('💾 Actualizando pedido...');
    const updatedOrder = await Orders.findByIdAndUpdate( req.params.id, updates, { new: true, runValidators: true })
    
    // Validar que el pedido si exista
    if (!updatedOrder) {
      console.log('❌ Pedido no encontrado');
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    
    console.log('✅ Pedido actualizado exitosamente');
    // ESTADO DE OK
    res.status(200).json({ message: "Pedido actualizado con éxito", data: updatedOrder });
  } catch (error) {
    console.log('❌❌❌ ERROR EN PUT ORDERS ❌❌❌');
    console.log('Error completo:', error);
    console.log('Mensaje:', error.message);
    console.log('Stack:', error.stack);
    if (error.errors) {
      console.log('Errores de validación:', JSON.stringify(error.errors, null, 2));
    }
    // ESTADO DE ERROR EN INPUT DEL CLIENTE
    res.status(400).json({ 
      message: "Error al actualizar pedido", 
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : []
    });
  }
};

// DELETE (DELETE)
ordersController.deleteOrders = async (req, res) => {
  try {
    // Buscar pedido por ID
    const order = await Orders.findById(req.params.id);
    // Validar que el pedido si exista
    if (!order) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    // Eliminar pedido
    await Orders.findByIdAndDelete(req.params.id);
    // ESTADO DE BORRADO
    res.status(204).json({ message: "Pedido eliminado con éxito" });
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al eliminar pedido", error: error.message });
  }
}

export default ordersController;