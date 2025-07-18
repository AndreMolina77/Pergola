import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from 'lucide-react'
import ActionButton from './Buttons/ActionButton'

const DataTable = ({data = [], columns = [], isLoading = false, 
  pagination = {
    page: 1,
    pageSize: 10,
    total: 0
  },
  onPageChange, onPageSizeChange, onSort, onEdit, onDelete, onView, sortBy = null, sortOrder = 'asc', className = "" }) => {
  const [sortConfig, setSortConfig] = useState({ key: sortBy, direction: sortOrder })

  const handleSort = (columnKey) => {
    const column = columns.find(col => col.key === columnKey)
    if (!column?.sortable) return

    const direction = sortConfig.key === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key: columnKey, direction })
    if (onSort) onSort(columnKey, direction)
  }
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />
  }
  const renderCellContent = (item, column) => {
    const value = item[column.key]
    
    switch (column.type) {
      case 'badge':
        const badgeValue = value?.toString()?.toLowerCase() || 'unknown'
        const badgeColors = {
          // Estados generales
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-red-100 text-red-800', 
          pending: 'bg-yellow-100 text-yellow-800',
          'pendiente': 'bg-yellow-100 text-yellow-800',
          completed: 'bg-blue-100 text-blue-800',
          'completado': 'bg-blue-100 text-blue-800',
          // Estados de productos
          'disponible': 'bg-green-100 text-green-800',
          'agotado': 'bg-red-100 text-red-800',
          'en producción': 'bg-blue-100 text-blue-800',
          'descontinuado': 'bg-gray-100 text-gray-800',
          // Tipos de movimiento
          'venta': 'bg-green-100 text-green-800',
          'exhibición': 'bg-blue-100 text-blue-800',
          'producción': 'bg-orange-100 text-orange-800',
          'otro': 'bg-gray-100 text-gray-800',
          // Booleanos
          'true': 'bg-green-100 text-green-800',
          'false': 'bg-red-100 text-red-800',
          // Otros
          'colaborador': 'bg-blue-100 text-blue-800',
          'customer': 'bg-blue-100 text-blue-800'
        }
        let displayText = value
        if (typeof value === 'boolean') {
          displayText = value ? 'Verificado' : 'No verificado'
        } else if (value === true || value === 'true') {
          displayText = 'Verificado'
        } else if (value === false || value === 'false') {
          displayText = 'No verificado'
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColors[badgeValue] || 'bg-gray-100 text-gray-800'}`}>
            {displayText}
          </span>
        )
      case 'boolean':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {value ? 'Sí' : 'No'}
          </span>
        )
      case 'number':
        return <span className="font-mono">{value?.toLocaleString() || '0'}</span>
      case 'currency':
        const numValue = Number(value) || 0
        return <span className="font-mono text-green-600 font-medium">${numValue.toFixed(2)}</span>
      case 'percentage':
        const percentage = (Number(value) * 100).toFixed(1)
        return <span className="font-medium">{percentage}%</span>
      case 'date':
        if (!value) return '-'
        try {
          return new Date(value).toLocaleDateString('es-ES')
        } catch (error) {
          return value?.toString() || '-'
        }
      case 'image':
        if (value && typeof value === 'string') {
          return (
            <img src={value} alt="Imagen" className="w-12 h-12 object-cover rounded-lg border" onError={(e) => { e.target.style.display = 'none' }}/>
          )
        }
        return <span className="text-gray-400 text-xs">Sin imagen</span>
      case 'image-gallery':
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="flex -space-x-2">
              {value.slice(0, 3).map((img, index) => (
                <img key={index} src={img} alt={`Imagen ${index + 1}`} className="w-8 h-8 object-cover rounded-full border-2 border-white" onError={(e) => { e.target.style.display = 'none' }}/>
              ))}
              {value.length > 3 && (
                <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{value.length - 3}</span>
                </div>
              )}
            </div>
          )
        }
        return <span className="text-gray-400 text-xs">Sin imágenes</span>
      case 'badge-list':
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 2).map((item, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {typeof item === 'object' ? (item.name || item.correlative || 'Material') : item}
                </span>
              ))}
              {value.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                  +{value.length - 2}
                </span>
              )}
            </div>
          )
        }
        return <span className="text-gray-400 text-xs">Sin elementos</span>
      default:
        // Manejar objetos populados y clientes
        if (value && typeof value === 'object') {
          // Para clientes: mostrar nombre completo
          if ((column.key === 'customer' || column.key === 'customer') && value.name && value.lastName) {
            return `${value.name} ${value.lastName}`
          }
          // Para proveedores con contactPerson
          if ((column.key === 'provider' || column.key === 'supplier') && value.contactPerson) {
            return value.name || value.contactPerson
          }
          // Para objetos con name (categorías, colecciones, subcategorías, productos, etc.)
          if (value.name) return value.name
          if (value.description) return value.description
          // Para usuarios con username
          if (value.username) return value.username
          // Si es un objeto pero no sabemos qué mostrar
          return value._id?.slice(-6) || 'N/A'
        }
        // Para arrays, mostrar cantidad
        if (Array.isArray(value)) {
          return `${value.length} elemento${value.length !== 1 ? 's' : ''}`
        }
        // Para valores simples
        return value?.toString() || '-'
    }
  }
  const totalPages = Math.ceil(pagination.total / pagination.pageSize)

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A73249] mx-auto"></div>
          <p className="mt-2 text-[#3D1609] font-[Quicksand]">Cargando datos...</p>
        </div>
      </div>
    )
  }
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`px-6 py-4 text-left text-xs font-medium text-[#5d1700] uppercase tracking-wider font-[Quicksand] ${ column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : '' }`} onClick={() => handleSort(column.key)}>
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-medium text-[#5d1700] uppercase tracking-wider font-[Quicksand]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-[#5d1700] font-[Quicksand]">
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-[#0e0502] font-[Quicksand]">
                      {renderCellContent(item, column)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <ActionButton variant="ghost" size="icon" icon={Eye} onClick={() => onView(item)}/>
                      )}
                      {onEdit && (
                        <ActionButton variant="ghost" size="icon" icon={Edit} onClick={() => onEdit(item)}/>
                      )}
                      {onDelete && (
                        <ActionButton variant="ghost" size="icon" icon={Trash2} onClick={() => onDelete(item)}/>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Paginacion */}
      {pagination.total > 0 && (
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#541f0d] font-[Quicksand]">
              Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} a{' '}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{' '}
              {pagination.total} resultados
            </span>
            <select value={pagination.pageSize} onChange={(e) => onPageSizeChange?.(Number(e.target.value))} className="text-sm border border-gray-300 rounded px-2 py-1 font-[Quicksand]">
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div> 
          <div className="flex items-center gap-2">
            <ActionButton variant="ghost" size="icon" icon={ChevronLeft} disabled={pagination.page === 1} onClick={() => onPageChange?.(pagination.page - 1)}/>
            {/* Numeros de pagina */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, pagination.page - 2) + i
                if (pageNum > totalPages) return null
                return (
                  <button key={pageNum} onClick={() => onPageChange?.(pageNum)} className={`px-3 py-1 text-sm rounded font-[Alexandria] transition-colors ${ pageNum === pagination.page ? 'bg-[#A73249] text-white' : 'text-[#5d1700] hover:bg-gray-100'}`}>
                    {pageNum}
                  </button>
                )
              })}
            </div>    
            <ActionButton variant="ghost" size="icon" icon={ChevronRight} disabled={pagination.page === totalPages} onClick={() => onPageChange?.(pagination.page + 1)}/>
          </div>
        </div>
      )}
    </div>
  )
}
export default DataTable