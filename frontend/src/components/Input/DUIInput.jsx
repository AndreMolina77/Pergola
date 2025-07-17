import { useState } from 'react'

const DUIInput = ({ text, value, onChange, disabled = false, required = false }) => {
  const [formattedValue, setFormattedValue] = useState(value)

  const formatDUI = (input) => {
    // Remover todos los caracteres no numéricos
    const cleaned = input.replace(/\D/g, '')
    // Limitar a 9 dígitos
    const limited = cleaned.slice(0, 9)
    // Formatear como 00000000-0
    if (limited.length >= 9) {
      return limited.slice(0, 8) + '-' + limited.slice(8)
    } else if (limited.length >= 8) {
      return limited.slice(0, 8) + '-'
    } else {
      return limited
    }
  }
  const handleChange = (e) => {
    const input = e.target.value
    const formatted = formatDUI(input)
    setFormattedValue(formatted)
    // Pasar el valor formateado al componente padre
    onChange({ target: { name: e.target.name, value: formatted } })
  }
  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 text-sm text-left text-[#3D1609] font-[Quicksand] font-semibold">{text}</label>
      <input 
        type="text" 
        value={formattedValue} 
        onChange={handleChange} 
        placeholder="00000000-0" 
        disabled={disabled} 
        required={required} 
        maxLength={10}
        className={`bg-[#E8E1D8] border border-[#A73249] rounded-md px-3 py-2 outline-none text-[#3D1609] font-[Nunito] placeholder-[#39312f] transition focus:border-[#A73249] focus:ring-2 focus:ring-[#A73249]/20 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#50352C]'}`}
      />
    </div>
  )
}
export default DUIInput