import { useState, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { User, Camera, Mail, Phone, Shield, Palette, Moon, Sun, Bell, Save, Eye, EyeOff } from 'lucide-react'
 
const SettingsPage = () => {
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  // Estados para la informacion del perfil (solo para mostrar, no editable)
  const [profileData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    profilePic: user?.profilePic || ''
  })
  // Estados para cambio de contraseña (no funcional por ahora)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  // Estados para preferencias (simulados localmente)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState('es')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [browserNotifications, setBrowserNotifications] = useState('default')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  // Funciones de manejo simplificadas (solo para UI por ahora)
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
   
    // Simular carga de imagen
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert('Funcionalidad de imagen deshabilitada temporalmente')
    }, 1000)
  }
  // Manejar actualizacion del perfil (solo por UI por ahora)
  const handleProfileUpdate = () => {
    alert('Funcionalidad de actualización deshabilitada temporalmente')
  }
  // Manejar cambio de contraseña
  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Por favor completa todos los campos de contraseña')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas nuevas no coinciden')
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert('Funcionalidad de cambio de contraseña deshabilitada temporalmente')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }, 1000)
  }
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)
  const toggleEmailNotifications = () => setEmailNotifications(!emailNotifications)
 
  const handleBrowserNotifications = () => {
    alert('Funcionalidad de notificaciones deshabilitada temporalmente')
  }
  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'preferences', label: 'Preferencias', icon: Palette }
  ]
  return (
    <div className={`p-6 min-h-screen font-[Quicksand] transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>
            ⚙️ Configuración
          </h1>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Personaliza tu perfil y preferencias
          </p>
        </div>
        {/* Tabs */}
        <div className={`flex space-x-1 mb-8 p-1 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {tabs.map(tab => { const IconComponent = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all flex-1 justify-center ${
                  activeTab === tab.id ? isDarkMode  ? 'bg-gray-700 text-[#A73249] shadow-sm' : 'bg-white text-[#A73249] shadow-sm' : isDarkMode ? 'text-gray-300 hover:text-[#A73249]' : 'text-gray-600 hover:text-[#A73249]' }`}>
                <IconComponent className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
        {/* Contenido de las tabs */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {/* Tab: Perfil */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>
                Información del Perfil
              </h2>  
              {/* Foto de perfil */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white">
                    {profileData.profilePic ? (
                      <img src={profileData.profilePic} alt="Perfil" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex' }}/>
                    ) : null}
                    <div className={`w-full h-full bg-gradient-to-br from-[#A73249] to-[#D4667A] flex items-center justify-center text-white text-2xl font-bold ${profileData.profilePic ? 'hidden' : 'flex'}`} style={{ display: profileData.profilePic ? 'none' : 'flex' }}>
                      {`${profileData.name?.charAt(0) || user?.name?.charAt(0) || 'U'}${profileData.lastName?.charAt(0) || user?.lastName?.charAt(0) || ''}`}
                    </div>
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="absolute -bottom-2 -right-2 bg-[#A73249] text-white p-2 rounded-full hover:bg-[#8A2A3E] transition-colors shadow-lg disabled:opacity-50 group">
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    ) : (
                      <Camera className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                    )}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>
                    {profileData.name} {profileData.lastName}
                  </h3>
                  <p className={`capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {user?.userType}
                  </p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Haz clic en el ícono de cámara para cambiar tu foto
                  </p>
                </div>
              </div>
              {/* Aviso de modo solo lectura */}
              <div className={`mb-6 p-4 rounded-lg border ${isDarkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  ℹ️ <strong>Modo de solo lectura:</strong> Los campos están deshabilitados temporalmente. Esta información se obtiene de tu sesión actual.
                </p>
              </div>
              {/* Formulario de perfil - SOLO LECTURA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    Nombre *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type="text" value={profileData.name} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'} cursor-not-allowed`} placeholder="Tu nombre" disabled readOnly/>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    Apellido *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type="text" value={profileData.lastName} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'} cursor-not-allowed`} placeholder="Tu apellido" disabled readOnly/>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type="email" value={profileData.email} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'} cursor-not-allowed`} placeholder="tu@email.com" disabled readOnly/>
                  </div>
                </div>
                {user?.userType !== 'admin' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      <input type="tel" value={profileData.phoneNumber || 'No especificado'} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'} cursor-not-allowed`} placeholder="0000-0000" disabled readOnly/>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={handleProfileUpdate} disabled={true} className="flex items-center space-x-2 bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed opacity-50">
                <Save className="w-4 h-4" />
                <span>Funcionalidad deshabilitada</span>
              </button>
            </div>
          )}
          {/* Tab: Seguridad */}
          {activeTab === 'security' && (
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>
                Seguridad
              </h2>
              <div className={`border rounded-lg p-4 mb-6 ${isDarkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  Cambiar Contraseña
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                  Asegúrate de usar una contraseña segura con al menos 8 caracteres.
                </p>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    Contraseña Actual
                  </label>
                  <div className="relative">
                    <Shield className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type={showPasswords.current ? 'text' : 'password'} value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} placeholder="Tu contraseña actual"/>
                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))} className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Shield className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type={showPasswords.new ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} placeholder="Nueva contraseña (mín. 8 caracteres)"/>
                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))} className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Shield className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type={showPasswords.confirm ? 'text' : 'password'} value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} placeholder="Confirma tu nueva contraseña"/>
                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))} className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={handlePasswordChange} disabled={isLoading} className="flex items-center space-x-2 bg-[#A73249] text-white px-6 py-3 rounded-lg hover:bg-[#8A2A3E] transition-colors disabled:opacity-50">
                <Shield className="w-4 h-4" />
                <span>{isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}</span>
              </button>
            </div>
          )}
          {/* Tab: Preferencias */}
          {activeTab === 'preferences' && (
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>
                Preferencias
              </h2>
              {/* Aviso sobre preferencias temporales */}
              <div className={`mb-6 p-4 rounded-lg border ${isDarkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  ⚠️ <strong>Configuraciones temporales:</strong> Estas preferencias solo se aplican en esta sesión y se perderán al recargar la página.
                </p>
              </div>
              <div className="space-y-6">
                {/* Tema */}
                <div className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    {isDarkMode ?
                      <Moon className="w-5 h-5 text-blue-400" /> :
                      <Sun className="w-5 h-5 text-yellow-500" />
                    }
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>Tema</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Claro u oscuro (temporal)</p>
                    </div>
                  </div>
                  <button onClick={toggleDarkMode} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ isDarkMode ? 'bg-[#A73249]' : 'bg-gray-300' }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ isDarkMode ? 'translate-x-6' : 'translate-x-1' }`}/>
                  </button>
                </div>
                {/* Idioma */}
                <div className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <Palette className="w-5 h-5 text-purple-500" />
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>Idioma</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Idioma de la interfaz (temporal)</p>
                    </div>
                  </div>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'}`}>
                    <option value="es">🇪🇸 Español</option>
                    <option value="en">🇺🇸 English</option>
                  </select>
                </div>
                {/* Notificaciones Email */}
                <div className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-green-500" />
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>Notificaciones por Email</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {emailNotifications ? 'Activadas (simulado)' : 'Desactivadas (simulado)'}
                      </p>
                    </div>
                  </div>
                  <button onClick={toggleEmailNotifications} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ emailNotifications ? 'bg-[#A73249]' : 'bg-gray-300' }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ emailNotifications ? 'translate-x-6' : 'translate-x-1' }`}/>
                  </button>
                </div>
                {/* Notificaciones del Navegador */}
                <div className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>Notificaciones del Navegador</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{browserNotifications === 'granted' ? 'Notificaciones activadas (simulado)' : browserNotifications === 'denied' ? 'Notificaciones bloqueadas (simulado)' : 'Notificaciones desactivadas (simulado)' }
                      </p>
                    </div>
                  </div>
                  <button onClick={handleBrowserNotifications} className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${ browserNotifications === 'granted' ? 'bg-[#A73249] hover:bg-[#8A2A3E]' : 'bg-[#A73249] hover:bg-[#8A2A3E]' }`}>
                      {browserNotifications === 'granted' ? 'Probar' : 'Activar'}
                  </button>
                </div>
                {/* Información del usuario actual */}
                <div className={`p-4 rounded-lg border-l-4 border-l-[#A73249] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>👤 Información de Sesión</h4>
                  <div className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>📧 Email: <span className="font-medium">{user?.email || 'No disponible'}</span></p>
                    <p>🏷️ Tipo de Usuario: <span className="font-medium capitalize">{user?.userType || 'No disponible'}</span></p>
                    <p>🆔 ID: <span className="font-medium">{user?.id || 'No disponible'}</span></p>
                    <p>🎨 Tema: <span className="font-medium">{isDarkMode ? 'Oscuro' : 'Claro'}</span></p>
                    <p>🌍 Idioma: <span className="font-medium">{language === 'es' ? 'Español' : 'English'}</span></p>
                  </div>
                </div>
                <div className={`p-4 rounded-lg border-l-4 border-l-[#A73249] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>👤 Información de Sesión</h4>
                  <div className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>📧 Email: <span className="font-medium">{user?.email || 'No disponible'}</span></p>
                    <p>🏷️ Tipo de Usuario: <span className="font-medium capitalize">{user?.userType || 'No disponible'}</span></p>
                    <p>🆔 ID: <span className="font-medium">{user?.id || 'No disponible'}</span></p>
                    <p>🎨 Tema: <span className="font-medium">{isDarkMode ? 'Oscuro' : 'Claro'}</span></p>
                    <p>🌍 Idioma: <span className="font-medium">{language === 'es' ? 'Español' : 'English'}</span></p>
                  </div>
                </div>
              </div>
              {/* Tips */}
              <div className={`mt-8 p-4 border rounded-lg ${ isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200' }`}>
                <p className={`text-sm ${ isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  💡 <strong>Estado Actual:</strong>
                </p>
                <ul className={`text-sm mt-2 space-y-1 ${ isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  <li>• Información del perfil obtenida de tu sesión activa</li>
                  <li>• Las configuraciones de tema son temporales en esta vista</li>
                  <li>• La funcionalidad completa se habilitará próximamente</li>
                  <li>• Los datos se actualizan automáticamente desde el servidor</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default SettingsPage