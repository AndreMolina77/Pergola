const logoutController = {}
// POST (CREATE)
logoutController.logout = async (req, res) => {
  // Se borra la cookie que contiene el token para que el usuario tenga que volver a iniciar sesión
  res.clearCookie("authToken")
  // ESTADO DE OK
  res.status(200).json({message: "Sesión cerrada correctamente"})
}
export default logoutController