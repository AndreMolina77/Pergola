// Configuracion para Categorias
export const categoriesConfig = {
  title: "Categorías",
  columns: [
    { key: 'name', label: 'Nombre', sortable: true, searchable: true },
    { key: 'description', label: 'Descripción', searchable: true },
    { key: 'image', label: 'Imagen', type: 'image' },
    { key: 'isActive', label: 'Activa', sortable: true, type: 'badge' },
    { key: 'createdAt', label: 'Fecha de Creación', sortable: true, type: 'date' }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre de la Categoría', required: true, placeholder: 'Ej: Diseños pre-establecidos' },
    { name: 'description', type: 'textarea', label: 'Descripción', required: true, placeholder: 'Describe la categoría...', rows: 3 },
    { name: 'image', type: 'image', label: 'Imagen', accept: 'image/*', placeholder: 'Seleccionar imagen' }
  ]
}
// Configuracion para Subcategorías
export const subcategoriesConfig = {
  title: "Subcategorías",
  columns: [
    { key: 'name', label: 'Nombre', sortable: true, searchable: true },
    { key: 'description', label: 'Descripción', searchable: true },
    { key: 'image', label: 'Imagen', type: 'image' },
    { key: 'isActive', label: 'Activa', sortable: true, type: 'badge' },
    { key: 'createdAt', label: 'Fecha de Creación', sortable: true, type: 'date' }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre de la Subcategoría', required: true, placeholder: 'Ej: Dijes' },
    { name: 'description', type: 'textarea', label: 'Descripción', required: true, placeholder: 'Describe la categoría...', rows: 3 },
    { name: 'image', type: 'image', label: 'Imagen', accept: 'image/*', placeholder: 'Seleccionar imagen' }
  ]
}
// Configuracion para Colecciones
export const collectionsConfig = {
  title: "Colecciones",
  columns: [
    { key: 'name', label: 'Nombre', sortable: true, searchable: true },
    { key: 'description', label: 'Descripción', searchable: true },
    { key: 'image', label: 'Imagen', type: 'image' },
    { key: 'isActive', label: 'Activa', sortable: true, type: 'badge' },
    { key: 'createdAt', label: 'Fecha de Creación', sortable: true, type: 'date' }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre de la Colección', required: true, placeholder: 'Ej: Cristal Bohemio' },
    { name: 'description', type: 'textarea', label: 'Descripción', required: true, placeholder: 'Describe la categoría...', rows: 3 },
    { name: 'image', type: 'image', label: 'Imagen', accept: 'image/*', placeholder: 'Seleccionar imagen' }
  ]
}
// Configuracion para Proveedores
export const suppliersConfig = {
  title: "Proveedores",
  columns: [
    { key: 'name', label: 'Nombre', sortable: true, searchable: true },
    { key: 'contactPerson', label: 'Persona de Contacto', sortable: true, searchable: true },
    { key: 'phoneNumber', label: 'Teléfono', searchable: true },
    { key: 'email', label: 'Email', sortable: true, searchable: true },
    { key: 'address', label: 'Dirección', searchable: true },
    { key: 'createdAt', label: 'Fecha de Registro', sortable: true, type: 'date' }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre del Proveedor', required: true, placeholder: 'Ej: Distcaribe' },
    { name: 'contactPerson', type: 'text', label: 'Persona de Contacto', required: true, placeholder: 'Ej: Juan Pérez' },
    { name: 'phoneNumber', type: 'tel', label: 'Teléfono', required: true, placeholder: '2234-5678' },
    { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'proveedor@email.com' },
    { name: 'address', type: 'textarea', label: 'Dirección', required: true, placeholder: 'Dirección completa...', rows: 2 }
  ]
}
// Configuracion para Productos
export const productsConfig = {
  title: "Productos",
  columns: [
    { key: 'codeProduct', label: 'Código', sortable: true, searchable: true },
    { key: 'name', label: 'Nombre', sortable: true, searchable: true },
    { key: 'description', label: 'Descripción', searchable: true },
    { key: 'images', label: 'Imágenes', type: 'image-gallery' },
    { key: 'stock', label: 'Stock', sortable: true, type: 'number' },
    { key: 'price', label: 'Precio', sortable: true, type: 'currency' },
    { key: 'productionCost', label: 'Costo Producción', sortable: true, type: 'currency' },
    { key: 'discount', label: 'Descuento', sortable: true, type: 'percentage' },
    { key: 'collection', label: 'Colección', sortable: true },
    { key: 'category', label: 'Categoría', sortable: true },
    { key: 'subcategory', label: 'Subcategoría', sortable: true },
    { key: 'rawMaterialsUsed', label: 'Materiales', type: 'badge-list' },
    { key: 'highlighted', label: 'Destacado', sortable: true, type: 'boolean' },
    { key: 'correlative', label: 'Correlativo', sortable: true },
    { key: 'movementType', label: 'Tipo Movimiento', sortable: true, type: 'badge' },
    { key: 'status', label: 'Estado', sortable: true, type: 'badge' },
    { key: 'applicableCosts', label: 'Costos Aplicables', searchable: true },
    { key: 'hasDiscount', label: 'Tiene Descuento', sortable: true, type: 'boolean' },
    { key: 'createdAt', label: 'Creado', sortable: true, type: 'date' }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre del Producto', required: true, placeholder: 'Ej: Anillo de oro' },
    { name: 'description', type: 'textarea', label: 'Descripción', required: true, placeholder: 'Descripción detallada...', rows: 4 },
    { name: 'codeProduct', type: 'text', label: 'Código de Producto', required: true, placeholder: 'Ej: AN-OR-001' },
    { name: 'images', type: 'imageArray', label: 'Imágenes', accept: 'image/*', multiple: true, placeholder: 'Seleccionar imágenes' },
    { name: 'price', type: 'number', label: 'Precio de Venta', required: true, placeholder: '0.00', min: 0.01, step: 0.01 },
    { name: 'productionCost', type: 'number', label: 'Costo de Producción', required: true, placeholder: '0.00', min: 0, step: 0.01 },
    { name: 'stock', type: 'number', label: 'Stock Disponible', required: true, placeholder: '0', min: 0 },
    { name: 'discount', type: 'number', label: 'Descuento (0-1)', placeholder: '0', min: 0, max: 1, step: 0.01 },
    { name: 'collection', type: 'select', label: 'Colección', required: true, options: 'collections' },
    { name: 'category', type: 'select', label: 'Categoría', required: true, options: 'categories' },
    { name: 'subcategory', type: 'select', label: 'Subcategoría', required: true, options: 'subcategories' },
    { name: 'rawMaterialsUsed', type: 'select-multiple', label: 'Materiales Usados', required: true, options: 'rawMaterials' },
    { name: 'highlighted', type: 'checkbox', label: 'Producto Destacado' },
    { name: 'correlative', type: 'text', label: 'Correlativo', required: true, placeholder: 'Ej: 001' },
    { name: 'movementType', type: 'select', label: 'Tipo de Movimiento', required: true, 
      options: [
        { value: 'venta', label: 'Venta' },
        { value: 'exhibición', label: 'Exhibición' },
        { value: 'producción', label: 'Producción' },
        { value: 'otro', label: 'Otro' }
      ]
    },
    { name: 'status', type: 'select', label: 'Estado', required: true,
      options: [
        { value: 'disponible', label: 'Disponible' },
        { value: 'agotado', label: 'Agotado' },
        { value: 'en producción', label: 'En Producción' },
        { value: 'descontinuado', label: 'Descontinuado' }
      ]
    },
    { name: 'applicableCosts', type: 'text', label: 'Costos Aplicables', placeholder: 'Ej: fabricación, embalaje' },
    { name: 'hasDiscount', type: 'checkbox', label: 'Aplica Descuento' }
  ]
}
// Configuracion para Materias Primas
export const rawMaterialsConfig = {
  title: "Materias Primas",
  columns: [
    { key: 'correlative', label: 'Código', sortable: true, searchable: true },
    { key: 'name', label: 'Nombre', sortable: true, searchable: true },
    { key: 'description', label: 'Descripción', searchable: true },
    { key: 'type', label: 'Tipo', sortable: true },
    { key: 'color', label: 'Color', sortable: true },
    { key: 'tone', label: 'Tono', sortable: true },
    { key: 'toneType', label: 'Tipo Tono', sortable: true },
    { key: 'texture', label: 'Textura', sortable: true },
    { key: 'shape', label: 'Forma', sortable: true },
    { key: 'dimension', label: 'Dimensión', sortable: true },
    { key: 'provider', label: 'Proveedor', sortable: true },
    { key: 'brand', label: 'Marca', sortable: true },
    { key: 'presentation', label: 'Presentación', sortable: true },
    { key: 'quantity', label: 'Cantidad', sortable: true, type: 'number' },
    { key: 'piecesPerPresentation', label: 'Piezas x Pres.', sortable: true, type: 'number' },
    { key: 'totalPieces', label: 'Total Piezas', sortable: true, type: 'number' },
    { key: 'piecePrice', label: 'Precio Unitario', sortable: true, type: 'currency' },
    { key: 'purchaseDate', label: 'Fecha Compra', sortable: true, type: 'date' },
    { key: 'stock', label: 'Stock', sortable: true, type: 'number' },
    { key: 'createdAt', label: 'Creado', sortable: true, type: 'date' }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true
  },
  formFields: [
    { name: 'correlative', type: 'text', label: 'Código Correlativo', required: true, placeholder: 'Ej: MP-001' },
    { name: 'name', type: 'text', label: 'Nombre', required: true, placeholder: 'Ej: Oro 18k' },
    { name: 'description', type: 'textarea', label: 'Descripción', required: true, placeholder: 'Descripción detallada...', rows: 3 },
    { name: 'type', type: 'text', label: 'Tipo', required: true, placeholder: 'Ej: metal, piedra, etc.' },
    { name: 'color', type: 'text', label: 'Color', placeholder: 'Ej: dorado' },
    { name: 'tone', type: 'text', label: 'Tono', placeholder: 'Ej: brillante' },
    { name: 'toneType', type: 'text', label: 'Tipo de Tono', placeholder: 'Ej: claro' },
    { name: 'texture', type: 'text', label: 'Textura', placeholder: 'Ej: liso' },
    { name: 'shape', type: 'text', label: 'Forma', placeholder: 'Ej: lingote' },
    { name: 'dimension', type: 'text', label: 'Dimensión', placeholder: 'Ej: 5x2x1 cm' },
    { name: 'provider', type: 'select', label: 'Proveedor', required: true, options: 'suppliers' },
    { name: 'brand', type: 'text', label: 'Marca', placeholder: 'Ej: Metalor' },
    { name: 'presentation', type: 'text', label: 'Presentación', required: true, placeholder: 'Ej: lingote, rollo' },
    { name: 'quantity', type: 'number', label: 'Cantidad', required: true, placeholder: '0', min: 0 },
    { name: 'piecesPerPresentation', type: 'number', label: 'Piezas por Presentación', required: true, placeholder: '1', min: 1 },
    { name: 'totalPieces', type: 'number', label: 'Total Piezas', required: true, placeholder: '0', min: 0 },
    { name: 'piecePrice', type: 'number', label: 'Precio por Pieza', required: true, placeholder: '0.00', min: 0.01, step: 0.01 },
    { name: 'purchaseDate', type: 'date', label: 'Fecha de Compra', required: true },
    { name: 'stock', type: 'number', label: 'Stock Actual', required: true, placeholder: '0', min: 0 }
  ]
}
// Configuracion para Reseñas
export const reviewsConfig = {
  title: "Reseñas",
  columns: [
    { key: 'rating', label: 'Calificación', sortable: true, type: 'number' },
    { key: 'comment', label: 'Comentario', searchable: true },
    { key: 'product', label: 'Producto', sortable: true },
    { key: 'customer', label: 'Cliente', sortable: true },
    { key: 'response', label: 'Respuesta', searchable: true },
    { key: 'createdAt', label: 'Fecha', sortable: true, type: 'date' }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true
  },
  formFields: [
    { name: 'rating', type: 'number', label: 'Calificación (1-5)', required: true, min: 1, max: 5, step: 1, validate: { validator: Number.isInteger, message: "La calificación debe ser un número entero" } },
    { name: 'comment', type: 'textarea', label: 'Comentario', required: true, placeholder: 'Escribe un comentario (mínimo 10 caracteres)...', rows: 4, minlength: 10, maxlength: 500 },
    { key: 'product', type: 'select', label: 'Producto', required: true, options: 'products' },
    { key: 'customer', type: 'select', label: 'Cliente', required: true, options: 'customers' },
    { key: 'response', type: 'textarea', label: 'Respuesta', required: false, placeholder: 'Escribe una respuesta...', rows: 4, maxlength: 50 }
  ]
}
// Configuración para diseños únicos
export const customDesignsConfig = {
  title: "Diseños únicos",
  columns: [
    { key: 'codeRequest', label: 'Código de Solicitud', sortable: true, searchable: true },
    { key: 'piece', label: 'Pieza', sortable: true, searchable: true },
    { key: 'base', label: 'Base', sortable: true, searchable: true },
    { key: 'baseLength', label: 'Longitud de Base', sortable: true, searchable: true },
    { key: 'decoration', label: 'Decoración', sortable: true, searchable: true },
    { key: 'clasp', label: 'Cierre', sortable: true, searchable: true },
    { key: 'customerComments', label: 'Comentarios del Cliente', searchable: true },
    { key: 'createdAt', label: 'Fecha', sortable: true, type: 'date' }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true
  },
  formFields: [
    { name: 'codeRequest', type: 'text', label: 'Código de Solicitud', required: true, placeholder: 'Ej: D-001' },
    { name: 'piece', type: 'text', label: 'Pieza', required: true, placeholder: 'Ej: Pulsera' },
    { name: 'base', type: 'text', label: 'Base', required: true, placeholder: 'Ej: metal' },
    { name: 'baseLength', type: 'text', label: 'Longitud de Base', required: true, placeholder: 'Ej: 10 cm' },
    { name: 'decoration', type: 'text', label: 'Decoración', required: true, placeholder: 'Ej: pulsera' },
    { name: 'clasp', type: 'text', label: 'Cierre', required: true, placeholder: 'Ej: clasp' },
    { name: 'customerComments', type: 'textarea', label: 'Comentarios del Cliente', required: true, placeholder: 'Ej: excelente diseño' }
  ]
}