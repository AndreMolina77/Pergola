import { FcGoogle } from 'react-icons/fc'

const GoogleAuthButton = ({ disabled = false }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className="w-full h-12 flex items-center justify-center gap-2 border-2 border-[#3D1609] rounded-md py-2 text-[#3D1609] font-[Quicksand] font-semibold hover:text-[#A73249]  transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FcGoogle className="text-xl" />
      Continuar con Google
    </button>
  )
}

export default GoogleAuthButton