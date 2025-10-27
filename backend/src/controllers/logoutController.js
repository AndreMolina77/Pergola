const logoutController = {}
// POST (CREATE)
logoutController.logout = async (req, res) => {
   try {
    // Borrar la cookie con las MISMAS opciones que se usaron al crearla
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/' // Asegurar que se borre desde la ruta raíz
    })
      
    console.log("✅ Cookie authToken eliminada correctamente")
    res.status(200).json({message: "Sesión cerrada correctamente"})
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error)
    res.status(500).json({message: "Error al cerrar sesión"})
  }
}
export default logoutController