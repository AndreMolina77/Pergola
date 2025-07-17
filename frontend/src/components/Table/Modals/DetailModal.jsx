import { Package, Tag, DollarSign, Star, Hash, FileText, Eye, Image, Layers, Building, Boxes, MessageSquare, CheckCircle, XCircle, Gem, Archive, Palette, Calendar, User, Mail, Phone, MapPin, Ruler, Paintbrush, Link } from 'lucide-react'
import BaseModal from './BaseModal'

const DetailModal = ({ isOpen, onClose, data, title = "Detalles", type = "generic" }) => {
  if (!data) return null
  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }
  // Función para formatear moneda
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0
    return `$${num.toFixed(2)}`
  }
  // Función para obtener el ícono según el campo
  const getFieldIcon = (fieldKey) => {
    const iconMap = {
      // Fechas
      createdAt: Calendar,
      updatedAt: Calendar,
      purchaseDate: Calendar,
      // Usuarios y personas
      name: User,
      contactPerson: User,
      customer: User,
      // Email y contacto
      email: Mail,
      phoneNumber: Phone,
      // Dirección
      address: MapPin,
      // Dinero
      price: DollarSign,
      piecePrice: DollarSign,
      productionCost: DollarSign,
      discount: DollarSign,
      // Productos y materiales
      stock: Archive,
      quantity: Archive,
      totalPieces: Archive,
      piecesPerPresentation: Archive,
      // Categorías y clasificaciones
      category: Tag,
      subcategory: Tag,
      collection: Layers,
      status: Tag,
      type: Tag,
      movementType: Tag,
      // Proveedores
      provider: Building,
      supplier: Building,
      // Materiales
      color: Palette,
      tone: Palette,
      toneType: Palette,
      texture: Palette,
      shape: Palette,
      dimension: Palette,
      brand: Tag,
      presentation: Package,
      correlative: Hash,
      // Calificaciones
      rating: Star,
      // Productos
      codeProduct: Hash,
      rawMaterialsUsed: Boxes,
      highlighted: Star,
      hasDiscount: DollarSign,
      applicableCosts: DollarSign,
      // IDs
      _id: Hash,
      // Texto y descripciones
      description: FileText,
      comment: MessageSquare,
      customerComments: MessageSquare,
      response: MessageSquare,
      // Imágenes
      image: Image,
      images: Image,
      // Estados
      isActive: CheckCircle,
      // Genérico
      default: Eye,
      // Diseños únicos
      codeRequest: Hash,
      piece: Gem,
      base: Gem,
      baseLength: Ruler,
      decoration: Paintbrush,
      clasp: Link
    }
    return iconMap[fieldKey] || iconMap.default
  }
  // Función para obtener configuración específica por tipo
  const getTypeConfig = () => {
    switch (type) {
      case 'products':
        return {
          fields: [
            { key: 'name', label: 'Nombre del Producto', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'codeProduct', label: 'Código de Producto', type: 'text' },
            { key: 'price', label: 'Precio', type: 'currency' },
            { key: 'productionCost', label: 'Costo de Producción', type: 'currency' },
            { key: 'discount', label: 'Descuento', type: 'percentage' },
            { key: 'hasDiscount', label: 'Tiene Descuento', type: 'badge' },
            { key: 'stock', label: 'Stock', type: 'number' },
            { key: 'highlighted', label: 'Destacado', type: 'badge' },
            { key: 'status', label: 'Estado', type: 'badge' },
            { key: 'movementType', label: 'Tipo de Movimiento', type: 'badge' },
            { key: 'correlative', label: 'Correlativo', type: 'text' },
            { key: 'applicableCosts', label: 'Costos Aplicables', type: 'text' },
            { key: 'collection', label: 'Colección', type: 'reference' },
            { key: 'category', label: 'Categoría', type: 'reference' },
            { key: 'subcategory', label: 'Subcategoría', type: 'reference' },
            { key: 'rawMaterialsUsed', label: 'Materias Primas', type: 'array' },
            { key: 'images', label: 'Imágenes', type: 'imageArray' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'categories':
        return {
          fields: [
            { key: 'name', label: 'Nombre de la Categoría', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'image', label: 'Imagen', type: 'image' },
            { key: 'isActive', label: 'Activa', type: 'badge' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'subcategories':
        return {
          fields: [
            { key: 'name', label: 'Nombre de la Subcategoría', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'image', label: 'Imagen', type: 'image' },
            { key: 'isActive', label: 'Activa', type: 'badge' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'collections':
        return {
          fields: [
            { key: 'name', label: 'Nombre de la Colección', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'image', label: 'Imagen', type: 'image' },
            { key: 'isActive', label: 'Activa', type: 'badge' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'suppliers':
        return {
          fields: [
            { key: 'name', label: 'Nombre del Proveedor', type: 'text' },
            { key: 'contactPerson', label: 'Persona de Contacto', type: 'text' },
            { key: 'phoneNumber', label: 'Teléfono', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'address', label: 'Dirección', type: 'text' },
            { key: 'createdAt', label: 'Fecha de Registro', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'rawmaterials':
        return {
          fields: [
            { key: 'correlative', label: 'Correlativo', type: 'text' },
            { key: 'name', label: 'Nombre', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'type', label: 'Tipo', type: 'text' },
            { key: 'color', label: 'Color', type: 'text' },
            { key: 'tone', label: 'Tono', type: 'text' },
            { key: 'toneType', label: 'Tipo de Tono', type: 'text' },
            { key: 'texture', label: 'Textura', type: 'text' },
            { key: 'shape', label: 'Forma', type: 'text' },
            { key: 'dimension', label: 'Dimensiones', type: 'text' },
            { key: 'brand', label: 'Marca', type: 'text' },
            { key: 'presentation', label: 'Presentación', type: 'text' },
            { key: 'quantity', label: 'Cantidad', type: 'number' },
            { key: 'piecesPerPresentation', label: 'Piezas por Presentación', type: 'number' },
            { key: 'totalPieces', label: 'Total de Piezas', type: 'number' },
            { key: 'piecePrice', label: 'Precio por Pieza', type: 'currency' },
            { key: 'stock', label: 'Stock', type: 'number' },
            { key: 'provider', label: 'Proveedor', type: 'reference' },
            { key: 'purchaseDate', label: 'Fecha de Compra', type: 'date' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'reviews':
        return {
          fields: [
            { key: 'product', label: 'Producto', type: 'reference' },
            { key: 'customer', label: 'Cliente', type: 'reference' },
            { key: 'rating', label: 'Calificación', type: 'rating' },
            { key: 'comment', label: 'Comentario', type: 'text' },
            { key: 'response', label: 'Respuesta', type: 'text' },
            { key: 'createdAt', label: 'Fecha de la Reseña', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'customDesigns':
        return {
          fields: [
            { key: 'codeRequest', label: 'Código de Solicitud', type: 'text' },
            { key: 'piece', label: 'Pieza', type: 'text' },
            { key: 'base', label: 'Base', type: 'text'},
            { key: 'baseLength', label: 'Longitud de Base', type: 'text' },
            { key: 'decoration', label: 'Decoración', type: 'text' },
            { key: 'clasp', label: 'Cierre', type: 'text' },
            { key: 'customerComments', label: 'Comentarios del Cliente', type: 'text' },
            { key: 'createdAt', label: 'Fecha de solicitud', type: 'date' },
            { key: 'updatedAt', label: 'Fecha de actualización', type: 'date' },
          ]
        }
      default:
        return {
          fields: Object.keys(data).map(key => ({
            key,
            label: key,
            type: 'text'
          }))
        }
    }
  }
  // Función para renderizar el valor según su tipo
  const renderFieldValue = (field, value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-500 italic">No especificado</span>
    }
    switch (field.type) {
      case 'currency':
        return <span className="font-semibold text-[#A73249]">{formatCurrency(value)}</span>
      case 'percentage':
        const percentage = (Number(value) * 100).toFixed(1)
        return <span className="font-medium text-[#3D1609]">{percentage}%</span>
      case 'number':
        return <span className="font-medium text-[#3D1609]">{Number(value).toLocaleString()}</span>
      case 'date':
        return <span className="text-gray-700">{formatDate(value)}</span>
      case 'email':
        return (
          <a href={`mailto:${value}`} className="text-[#A73249] hover:text-[#A73249]/80 hover:underline transition-colors">
            {value}
          </a>
        )
      case 'badge':
        const badgeValue = value?.toString()?.toLowerCase() || 'unknown'
        const badgeColors = {
          true: 'bg-green-100 text-green-800 border-green-200',
          false: 'bg-red-100 text-red-800 border-red-200',
          'disponible': 'bg-green-100 text-green-800 border-green-200',
          'agotado': 'bg-red-100 text-red-800 border-red-200',
          'en producción': 'bg-blue-100 text-blue-800 border-blue-200',
          'descontinuado': 'bg-gray-100 text-gray-800 border-gray-200',
          'venta': 'bg-green-100 text-green-800 border-green-200',
          'exhibición': 'bg-blue-100 text-blue-800 border-blue-200',
          'producción': 'bg-orange-100 text-orange-800 border-orange-200',
          'otro': 'bg-gray-100 text-gray-800 border-gray-200'
        }
        let displayText = value
        if (typeof value === 'boolean') {
          displayText = value ? 'Sí' : 'No'
        }
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badgeColors[badgeValue] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
            {displayText}
          </span>
        )
      case 'reference':
        if (typeof value === 'object' && value) {
          const displayName = value.name || value.contactPerson || value._id?.slice(-6) || 'Sin nombre'
          return (
            <div className="bg-[#E8E1D8] px-3 py-2 rounded-lg border">
              <div className="font-medium text-[#3D1609]">{displayName}</div>
              {value.email && (
                <div className="text-sm text-gray-600">{value.email}</div>
              )}
            </div>
          )
        }
        return <span className="text-gray-500 italic">Referencia no encontrada</span>
      case 'array':
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="space-y-2">
              {value.map((item, index) => (
                <div key={index} className="bg-[#E8E1D8] px-3 py-2 rounded-lg border">
                  <div className="font-medium text-[#3D1609]">
                    {typeof item === 'object' ? (item.name || item._id?.slice(-6) || `Elemento ${index + 1}`) : item}
                  </div>
                </div>
              ))}
              <div className="text-sm text-gray-600 font-medium">
                Total: {value.length} elemento{value.length !== 1 ? 's' : ''}
              </div>
            </div>
          )
        }
        return <span className="text-gray-500 italic">Sin elementos</span>
      case 'rating':
        const rating = Number(value) || 0
        return (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium text-[#3D1609]">({rating}/5)</span>
          </div>
        )
      case 'image':
        if (value && typeof value === 'string') {
          return (
            <div className="mt-2">
              <img src={value} alt="Imagen" className="w-40 h-40 object-cover rounded-lg border-2 border-[#E8E1D8] shadow-sm" onError={(e) => { e.target.style.display = 'none' }}/>
            </div>
          )
        }
        return <span className="text-gray-500 italic">Sin imagen</span>
      case 'imageArray':
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {value.map((img, index) => (
                <img key={index} src={img} alt={`Imagen ${index + 1}`} className="w-full h-32 object-cover rounded-lg border-2 border-[#E8E1D8] shadow-sm" onError={(e) => { e.target.style.display = 'none' }}/>
              ))}
            </div>
          )
        }
        return <span className="text-gray-500 italic">Sin imágenes</span>
      default:
        return <span className="text-gray-700">{value?.toString() || '-'}</span>
    }
  }
  const config = getTypeConfig()

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="p-6">
        {/* ID del elemento */}
        {data._id && (
          <div className="mb-6 p-4 bg-[#E8E1D8] rounded-lg border-2 border-[#A73249]/20">
            <div className="flex items-center gap-2 text-sm text-[#3D1609]">
              <Hash className="w-4 h-4 text-[#A73249]" />
              <span className="font-semibold font-[Quicksand]">ID:</span>
              <code className="bg-white px-3 py-1 rounded border font-mono text-xs text-[#3D1609]">
                {data._id}
              </code>
            </div>
          </div>
        )}
        {/* Campos de información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.fields.map((field) => {
            const value = data[field.key]
            const IconComponent = getFieldIcon(field.key)
            // No mostrar campos vacíos o de sistema en algunos casos
            if (field.key === '_id' || field.key === '__v') return null
            return (
              <div key={field.key} className={field.type === 'imageArray' || field.type === 'array' || (field.type === 'text' && field.key === 'description') ? 'md:col-span-2' : ''}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-[#A73249]" />
                    <label className="text-sm font-bold text-[#3D1609] font-[Quicksand]">
                      {field.label}
                    </label>
                  </div>
                  <div className="pl-7">
                    {renderFieldValue(field, value)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </BaseModal>
  )
}
export default DetailModal