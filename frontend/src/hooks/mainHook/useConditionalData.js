import { useAuth } from '../useAuth.js'
import useDataCategories from '../CategoriesHooks/useDataCategories'
import useDataSubcategories from '../subcategoriesHooks/useDataSubcategories'
import useDataCollections from '../collectionsHooks/useDataCollections'
import useDataSuppliers from '../SuppliersHooks/useDataSuppliers'
import useDataProducts from '../productsHooks/useDataProducts'
import useDataRawMaterials from '../rawMaterialsHooks/useDataRawMaterials'
import useDataReviews from '../ReviewsHooks/useDataReviews'
import useDataCustomDesigns from '../CustomDesignsHooks/useDataCustomDesigns'

export const useConditionalData = () => {
  const { user } = useAuth()
  // TODOS los hooks se ejecutan SIEMPRE (cumple reglas de React)
  const allSuppliersData = useDataSuppliers()
  const allCategoriesData = useDataCategories()
  const allSubcategoriesData = useDataSubcategories()
  const allCollectionsData = useDataCollections()
  const allProductsData = useDataProducts()
  const allRawMaterialsData = useDataRawMaterials()
  const allReviewsData = useDataReviews()
  const allCustomDesignsData = useDataCustomDesigns()
  
  const canAccess = (section) => {
    if (!user?.userType) return false
    
    const permissions = {
      'admin': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'employees', 'categories','subcategories', 'collections', 'customers', 'orders', 'reviews', 'refunds', 'transactions', 'suppliers', 'settings' ],
      'colaborador': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'categories','subcategories', 'collections', 'reviews', 'suppliers', 'settings' ],
    }
    return permissions[user.userType]?.includes(section) || false
  }
  // Objeto vacio para cuando no hay acceso
  const emptyData = { 
    data: [], 
    loading: false, 
    fetch: () => {},
    // Propiedades especificas segun el tipo de data
    suppliers: [],
    categories: [],
    subcategories: [],
    collections: [],
    products: [],
    rawmaterials: [],
    reviews: [],
    customdesigns: []
  }
  return {
    suppliersData: canAccess('suppliers') ? allSuppliersData : emptyData,
    categoriesData: canAccess('categories') ? allCategoriesData : emptyData,
    subcategoriesData: canAccess('subcategories') ? allSubcategoriesData : emptyData,
    collectionsData: canAccess('collections') ? allCollectionsData : emptyData,
    productsData: canAccess('products') ? allProductsData : emptyData,
    rawmaterialsData: canAccess('rawmaterials') ? allRawMaterialsData : emptyData,
    reviewsData: canAccess('reviews') ? allReviewsData : emptyData,
    customDesignsData: canAccess('customdesigns') ? allCustomDesignsData : emptyData,
    canAccess
  }
}