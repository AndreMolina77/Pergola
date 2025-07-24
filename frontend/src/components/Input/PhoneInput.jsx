import { useState } from 'react'

// Componente de input para ingresar y formatear número de teléfono
const PhoneInput = ({ text, name, value, onChange, disabled = false, required = false }) => {
  // Estado para almacenar el valor formateado
  const [formattedValue, setFormattedValue] = useState(value)

  // Función para formatear el número como 0000-0000
  const formatPhoneNumber = (input) => {
    // Remover todos los caracteres no numéricos
    const cleaned = input.replace(/\D/g, '')
    // Limitar a 8 dígitos
    const limited = cleaned.slice(0, 8)
    // Formatear como 0000-0000
    if (limited.length >= 5) {
      return limited.slice(0, 4) + '-' + limited.slice(4)
    } else {
      return limited
    }
  }

  // Maneja el cambio en el input y actualiza el valor formateado
  const handleChange = (e) => {
    const input = e.target.value
    const formatted = formatPhoneNumber(input)
    setFormattedValue(formatted)
    // Enviar el valor formateado (con guión) en lugar de solo números
    onChange({ target: { name: e.target.name, value: formatted } })
  }

  return (
    <div className="flex flex-col w-full">
      {/* Etiqueta del input */}
      <label className="mb-1 text-sm text-left text-[#3D1609] font-[Quicksand] font-semibold">{text}</label>
      {/* Input de texto para teléfono */}
      <input 
        type="text"
        name={name}
        value={formattedValue} 
        onChange={handleChange} 
        placeholder="0000-0000" 
        disabled={disabled} 
        required={required} 
        maxLength={9}
        className={`bg-[#E8E1D8] border border-[#A73249] rounded-md px-3 py-2 outline-none text-[#3D1609] font-[Nunito] placeholder-[#39312f] transition focus:border-[#A73249] focus:ring-2 focus:ring-[#A73249]/20 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#50352C]'}`}
      />
    </div>
  )
}
export default PhoneInput