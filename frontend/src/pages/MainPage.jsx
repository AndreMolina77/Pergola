import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'
import Sidebar from '../components/Dashboard/Sidebar'
import Header from '../components/Dashboard/Header'
import Dashboard from '../components/Dashboard/Dashboard'
import TableContainer from '../components/Table/TableContainer'
import SettingsPage from '../components/Settings/SettingsPage'
import ProgressScreen from '../components/Misc/ProgressScreen'
import { useConditionalData } from '../hooks/MainHook/useConditionalData.js'
// Importar configuraciones de tablas
import { suppliersConfig, categoriesConfig, subcategoriesConfig, collectionsConfig, productsConfig, rawMaterialsConfig, reviewsConfig, customDesignsConfig} from '../data/TableConfigs.js'

const MainPage = () => {
  const { user, logout, API } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard')
  // Usar el hook condicional - TODOS los hooks se ejecutan siempre
  const {
    suppliersData,
    categoriesData,
    subcategoriesData,
    customersData,
    collectionsData,
    productsData,
    rawmaterialsData,
    reviewsData,
    customDesignsData,
    canAccess
  } = useConditionalData()

  const handleLogout = async () => {
    await logout()
  }
  // Funcion handleExport
  const handleDataExport = () => {
    toast.error('⚠️ Función de exportar actualmente no disponible, muy pronto')
  }
  // Agregar funcion para verificar permisos
  const hasPermission = (view) => {
    if (!user?.userType) return false
    // Verificar si el usuario tiene permiso para la vista actual
    const permissions = {
      'admin': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'employees', 'categories','subcategories', 'collections', 'customers', 'orders', 'reviews', 'refunds', 'transactions', 'suppliers', 'settings' ],
      'colaborador': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'categories','subcategories', 'collections', 'reviews', 'suppliers', 'settings' ],
    }
    const userPermissions = permissions[user.userType] || []
    return userPermissions.includes(view) 
  }
  console.log("🐛 DEBUG MainPage - User:", user);
  console.log("🐛 DEBUG MainPage - Current view:", currentView);
  console.log("🐛 DEBUG MainPage - Has permission:", hasPermission(currentView));
  const renderContent = () => {
    // Verificar permisos antes de renderizar
    if (!hasPermission(currentView)) {
      console.log("❌ No permission for view:", currentView, "User type:", user?.userType);
      return (
        <div className="p-6 bg-white min-h-screen font-[Quicksand] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-red-600 mb-4">Acceso Denegado</h1>
            <p className="text-black">No tienes permisos para acceder a esta sección.</p>
            <p className="text-sm text-black mt-2">Tu rol: {user?.userType}</p>
            <p className="text-sm text-black">Sección: {currentView}</p>
          </div>
        </div>
      );
    }
    switch (currentView) {
      case 'dashboard':
        return <Dashboard/>
      case 'search':
        return <ProgressScreen/>
      case 'products':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={productsConfig} {...productsData.createHandlers(API)} onExport={handleDataExport} categoriesData={categoriesData} subcategoriesData={subcategoriesData} collectionsData={collectionsData} rawMaterialsData={rawmaterialsData}/>
            </div>
          </div>
        )
      case 'categories':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={categoriesConfig} {...categoriesData.createHandlers(API)} onExport={handleDataExport}/>
            </div>
          </div>
        )
      case 'subcategories':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={subcategoriesConfig} {...subcategoriesData.createHandlers(API)} onExport={handleDataExport}/>
            </div>
          </div>
        )
      case 'collections':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={collectionsConfig} {...collectionsData.createHandlers(API)} onExport={handleDataExport}/>
            </div>
          </div>
        )
      case 'suppliers':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={suppliersConfig} {...suppliersData.createHandlers(API)} onExport={handleDataExport}/>
            </div>
          </div>
        )
      case 'rawmaterials':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={rawMaterialsConfig} {...rawmaterialsData.createHandlers(API)} onExport={handleDataExport} suppliersData={suppliersData}/>
            </div>
          </div>
        )
      case 'reviews':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={reviewsConfig} {...reviewsData.createHandlers(API)} onExport={handleDataExport} customersData={customersData} productsData={productsData}/>
            </div>
          </div>
        )
      case 'customdesigns':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={customDesignsConfig} {...customDesignsData.createHandlers(API)} onExport={handleDataExport}/>
            </div>
          </div>
        )
      case 'settings':
        return <SettingsPage/>
      default: 
        return <Dashboard/>
    }
  }
  return (
    <div className="flex h-screen bg-white font-[Quicksand] overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout}/>
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
export default MainPage