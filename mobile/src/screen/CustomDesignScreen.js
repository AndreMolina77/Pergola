import React, { useMemo, useState } from 'react';
import { ChevronLeft, CheckCircle, XCircle, Sparkles } from 'lucide-react';

// Carga de Tailwind CSS: Asumimos que Tailwind está disponible en el entorno.

// --- CONSTANTES DE DISEÑO Y LÓGICA ---

// Definiciones de color
const COLORS = {
  primary: '#A73249', // Rojo vino
  dark: '#3D1609',   // Café oscuro
  background: '#E3C6B8', // Fondo Arena/Rosa pálido
  lightGray: '#E8E1D8', // Gris muy claro
  summaryBg: '#F5EDE8', // Fondo de Resumen
  error: '#D32F2F',    // Rojo de error
};

const STEPS = [
  { key: 'piece', title: 'Elige la pieza', description: 'Selecciona qué tipo de joya deseas diseñar.' },
  { key: 'base', title: 'Elige la base', description: 'Escoge el material base para tu joya.' },
  { key: 'baseLength', title: 'Longitud de la base', description: 'Especifica la longitud requerida (ej: 45cm).' },
  { key: 'decoration', title: 'Elige la decoración', description: 'Agrega toques únicos (puedes elegir varios).' },
  { key: 'clasp', title: 'Elige el cierre', description: 'Define el tipo de cierre para tu comodidad.' },
  { key: 'customerComments', title: 'Comentarios', description: 'Agrega algún detalle especial (opcional).' },
];

const OPTIONS = {
  piece: [
    { id: 'pulsera', label: 'Pulsera', price: 40, backendValue: 'Pulsera' },
    { id: 'cadena', label: 'Cadena', price: 55, backendValue: 'Cadena' },
    { id: 'tobillera', label: 'Tobillera', price: 35, backendValue: 'Tobillera' }
  ],
  base: [
    { id: 'oro', label: 'Oro 18k', price: 180, elementId: '507f1f77bcf86cd799439011' },
    { id: 'plata', label: 'Plata .925', price: 75, elementId: '507f1f77bcf86cd799439012' },
    { id: 'acero', label: 'Acero', price: 40, elementId: '507f1f77bcf86cd799439013' }
  ],
  decoration: [
    { id: 'perlas', label: 'Perlas', price: 35, elementId: '507f1f77bcf86cd799439014' },
    { id: 'zirconias', label: 'Zirconias', price: 28, elementId: '507f1f77bcf86cd799439015' },
    { id: 'inicial', label: 'Inicial', price: 18, elementId: '507f1f77bcf86cd799439016' },
    { id: 'amuleto', label: 'Amuleto', price: 22, elementId: '507f1f77bcf86cd799439017' }
  ],
  clasp: [
    { id: 'mosqueton', label: 'Mosquetón', price: 10, elementId: '507f1f77bcf86cd799439018' },
    { id: 'iman', label: 'Imán', price: 15, elementId: '507f1f77bcf86cd799439019' },
    { id: 'barra', label: 'Barra T', price: 18, elementId: '507f1f77bcf86cd799439020' },
    { id: 'resorte', label: 'Resorte', price: 8, elementId: '507f1f77bcf86cd799439021' }
  ]
};

// Componente Modal de Alerta/Éxito (Reemplaza a Alert.alert)
const AlertModal = ({ show, title, message, onClose, isError = false, submitCode = '', isLoading = false }) => {
  if (!show) return null;

  const Icon = isLoading ? Sparkles : (isError ? XCircle : CheckCircle);
  const color = isLoading ? 'text-blue-500' : (isError ? 'text-red-500' : 'text-green-500');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-11/12 max-w-sm p-6 bg-white rounded-xl shadow-2xl">
        <div className="flex flex-col items-center">
          {isLoading ? (
            <svg className={`w-12 h-12 animate-spin ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Icon size={48} className={color} />
          )}
          <h3 className="mt-4 text-xl font-bold text-gray-800">{title}</h3>
          <p className="mt-2 text-sm text-center text-gray-600 whitespace-pre-line">{message}</p>
          {submitCode && (
            <div className="mt-4 w-full p-3 text-center bg-gray-100 rounded-lg">
              <span className="text-xs font-semibold text-gray-500">CÓDIGO DE SOLICITUD</span>
              <p className="text-lg font-mono text-gray-800">{submitCode}</p>
            </div>
          )}
          {!isLoading && (
            <button
              onClick={onClose}
              className="w-full px-4 py-2 mt-6 text-white transition duration-200 rounded-lg bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


const CustomDesignsScreen = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState({
    piece: null,
    base: null,
    baseLength: '',
    decoration: [],
    clasp: null,
    customerComments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estado para el modal de alerta (usado también para loading de simulación)
  const [alert, setAlert] = useState({ show: false, title: '', message: '', isError: false, code: '', isLoading: false });
  
  const currentStep = STEPS[stepIndex];

  // --- LÓGICA DE VALIDACIÓN ---

  const validateBaseLength = (length) => {
    if (!length.trim()) {
      return { isValid: false, message: 'La longitud es requerida.' };
    }
    const regex = /^\d{1,3}(cm|mm)?$/i;
    const trimmedLength = length.trim();
    if (!regex.test(trimmedLength)) {
      return { isValid: false, message: 'Formato inválido. Usa: 45cm o 180mm.' };
    }

    const match = trimmedLength.match(/^(\d{1,3})(cm|mm)?$/i);
    const value = parseFloat(match[1]);
    const unit = (match[2] || 'cm').toLowerCase();

    if (unit === 'cm' && (value < 10 || value > 200)) {
      return { isValid: false, message: 'Longitud en cm debe ser entre 10 y 200.' };
    }
    if (unit === 'mm' && (value < 100 || value > 2000)) {
      return { isValid: false, message: 'Longitud en mm debe ser entre 100 y 2000.' };
    }

    return { isValid: true };
  };

  const validateComments = (comments) => {
    if (comments.length > 300) {
      return { isValid: false, message: `Máximo 300 caracteres. (${comments.length}/300)` };
    }
    return { isValid: true };
  };

  // --- CÁLCULO DE PRECIO Y CONTINUIDAD ---
  
  const estimatedPrice = useMemo(() => {
    let price = 0;
    if (selected.piece) price += selected.piece.price;
    if (selected.base) price += selected.base.price;
    if (selected.clasp) price += selected.clasp.price; 
    selected.decoration.forEach(deco => price += deco.price);
    return price;
  }, [selected.piece, selected.base, selected.clasp, selected.decoration]);


  const canContinue = useMemo(() => {
    // Para el paso 'decoration', debe haber al menos uno seleccionado
    if (currentStep.key === 'decoration') return selected.decoration.length > 0;
    
    // Para el paso 'baseLength', debe ser válido
    if (currentStep.key === 'baseLength') {
      return validateBaseLength(selected.baseLength).isValid;
    }
    
    // Para el paso 'customerComments', solo la validación de longitud, siempre se puede continuar
    if (currentStep.key === 'customerComments') return validateComments(selected.customerComments).isValid; 

    // Para todos los demás pasos (selección simple)
    return !!selected[currentStep.key]; 
  }, [selected, currentStep.key]);

  // --- LÓGICA DE NAVEGACIÓN Y SELECCIÓN ---

  const generateCodeRequest = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 5);
    return `DESIGN-${timestamp}-${random}`.toUpperCase();
  };

  const handleSelect = (groupKey, option) => {
    setSelected(prev => ({ ...prev, [groupKey]: option }));
    // Limpiar error específico al seleccionar
    if (errors[groupKey]) setErrors(prev => ({ ...prev, [groupKey]: null }));
  }

  const handleSelectDecoration = (option) => {
    setSelected(prev => {
      const isSelected = prev.decoration.some(deco => deco.elementId === option.elementId);
      let newDecorations;
      if (isSelected) {
        newDecorations = prev.decoration.filter(deco => deco.elementId !== option.elementId);
      } else {
        newDecorations = [...prev.decoration, option];
      }
      // Limpiar error de decoración si se selecciona al menos uno
      if (errors.decoration && newDecorations.length > 0) {
          setErrors(prev => ({ ...prev, decoration: null }));
      }

      return { ...prev, decoration: newDecorations };
    });
  };

  const next = () => {
    if (stepIndex < STEPS.length - 1 && canContinue) {
      setStepIndex(stepIndex + 1);
    }
  };

  const back = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
    else {
      // Mostrar confirmación de salida
      setAlert({
        show: true,
        title: 'Confirmar Salida',
        message: '¿Estás seguro de que quieres salir del proceso de diseño? Se perderán los cambios.',
        isError: true, 
        isLoading: false
      });
    }
  };

  const handleCloseAlert = () => {
    // Si la alerta no es de error y no está cargando (es decir, fue un éxito o un 'salir' no aceptado), reinicia el formulario.
    const shouldReset = alert.show && !alert.isError && !alert.isLoading && alert.code;
    setAlert({ show: false, title: '', message: '', isError: false, code: '', isLoading: false });
    
    if (shouldReset) {
        setStepIndex(0);
        setSelected({
            piece: null,
            base: null,
            baseLength: '',
            decoration: [],
            clasp: null,
            customerComments: ''
        });
        setErrors({});
    }
  }

  // --- LÓGICA DE ENVÍO FINAL ---

  const finish = async () => {
    // Revalidación completa de todos los campos obligatorios
    const baseLengthValidation = validateBaseLength(selected.baseLength);
    const commentsValidation = validateComments(selected.customerComments);
    
    const validationErrors = {};
    
    // Solo validamos pasos previos al final (Customer Comments es el último)
    if (!selected.piece) validationErrors.piece = 'Selecciona una pieza.';
    if (!selected.base) validationErrors.base = 'Selecciona un material base.';
    if (!baseLengthValidation.isValid) validationErrors.baseLength = baseLengthValidation.message;
    if (selected.decoration.length === 0) validationErrors.decoration = 'Selecciona al menos una decoración.';
    if (!selected.clasp) validationErrors.clasp = 'Selecciona un cierre.';
    if (!commentsValidation.isValid) validationErrors.customerComments = commentsValidation.message;
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const errorList = Object.values(validationErrors).filter(msg => msg).join('\n• ');
      
      setAlert({
        show: true,
        title: 'Datos incompletos',
        message: 'Por favor corrige los errores antes de enviar:\n\n• ' + errorList,
        isError: true,
        isLoading: false,
      });
      return;
    }

    setIsSubmitting(true);
    const designCode = generateCodeRequest();

    try {
      const designData = {
        codeRequest: designCode,
        piece: selected.piece.backendValue, 
        base: selected.base.elementId, 
        baseLength: selected.baseLength,
        decoration: selected.decoration.map(deco => deco.elementId), 
        clasp: selected.clasp.elementId, 
        customerComments: selected.customerComments
      };

      // Simulación de API call (sin IA)
      setAlert({ show: true, title: 'Procesando Solicitud...', message: 'Simulando envío al sistema de diseño...', isLoading: true });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAlert(prev => ({ ...prev, isLoading: false })); // Quitar loading
      const responseOk = true; // Simulación de respuesta exitosa

      if (responseOk) {
        setAlert({
          show: true,
          title: '🎉 Diseño creado con éxito',
          message: `El precio estimado es de $${estimatedPrice.toFixed(2)} USD. Nos pondremos en contacto para confirmar los detalles.`,
          isError: false,
          code: designCode,
          isLoading: false,
        });
      } else {
        throw new Error('Error del servidor al crear el diseño. (Simulado)');
      }
    } catch (error) {
      console.error('Error al crear diseño:', error);
      setAlert({
        show: true,
        title: '❌ Error',
        message: error.message || 'No se pudo crear el diseño. Intenta nuevamente.',
        isError: true,
        isLoading: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDERS DE PASOS ESPECIALES (INPUTS) ---
  
  const renderBaseLengthInput = () => {
    const error = errors.baseLength;
    return (
      <div className="mb-5">
        <label htmlFor="baseLength" className="block text-base font-semibold mb-2" style={{ color: COLORS.dark }}>
          Longitud de la base *
        </label>
        <input
          id="baseLength"
          type="text"
          className={`w-full bg-white border rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 ${
            error ? 'border-red-600 ring-red-200' : 'border-gray-200 focus:border-gray-400 focus:ring-gray-100'
          }`}
          style={{ color: COLORS.dark }}
          value={selected.baseLength}
          onChange={(e) => {
            setSelected(prev => ({ ...prev, baseLength: e.target.value }));
            if (error) setErrors(prev => ({ ...prev, baseLength: null }));
          }}
          placeholder="Ej: 45cm o 180mm"
          disabled={isSubmitting || alert.isLoading}
        />
        <p className={`text-xs mt-1 ${error ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
          {error ? error : 'Formato: 45cm o 180mm (sin decimales)'}
        </p>
      </div>
    );
  }

  const renderCommentsInput = () => {
    const error = errors.customerComments;
    return (
      <div className="mb-5">
        <label htmlFor="customerComments" className="block text-base font-semibold mb-2" style={{ color: COLORS.dark }}>
          Comentarios adicionales (opcional)
        </label>
        <textarea
          id="customerComments"
          className={`w-full bg-white border rounded-xl px-4 py-3 text-lg min-h-[100px] focus:outline-none focus:ring-2 ${
            error ? 'border-red-600 ring-red-200' : 'border-gray-200 focus:border-gray-400 focus:ring-gray-100'
          }`}
          style={{ color: COLORS.dark }}
          value={selected.customerComments}
          onChange={(e) => {
            setSelected(prev => ({ ...prev, customerComments: e.target.value }));
            if (error) setErrors(prev => ({ ...prev, customerComments: null }));
          }}
          placeholder="Algún detalle especial o instrucción..."
          maxLength={300}
          disabled={isSubmitting || alert.isLoading}
        />
        <p className={`text-xs mt-1 ${error ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
          {error ? error : `${selected.customerComments.length}/300 caracteres`}
        </p>
      </div>
    );
  }

  // --- RENDER DE OPCIONES (CHIPS) ---
  
  const renderOptions = () => {
    if (currentStep.key === 'baseLength') return renderBaseLengthInput();
    if (currentStep.key === 'customerComments') return renderCommentsInput();

    const currentOptions = OPTIONS[currentStep.key];
    const isMultiSelect = currentStep.key === 'decoration';
    const hasError = !!errors[currentStep.key];

    return (
      <>
        <div className="flex flex-wrap gap-2.5 mt-3">
          {currentOptions.map(opt => {
            const isSelected = isMultiSelect
              ? selected.decoration.some(deco => deco.elementId === opt.elementId)
              : selected[currentStep.key]?.elementId === opt.elementId;

            const chipClasses = `
              flex items-center gap-2 p-3 rounded-2xl transition duration-200
              shadow-sm
              ${isSelected
                ? `bg-[${COLORS.primary}] border-2 border-[${COLORS.primary}] text-white shadow-md shadow-red-200`
                : `bg-white border border-[${COLORS.lightGray}] text-[${COLORS.dark}] hover:shadow-md`
              }
              ${hasError && !isSelected ? 'border-2 border-red-600 shadow-lg shadow-red-100' : ''}
              ${isSubmitting || alert.isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            `;

            return (
              <button
                key={opt.id}
                className={chipClasses}
                onClick={() => isMultiSelect ? handleSelectDecoration(opt) : handleSelect(currentStep.key, opt)}
                disabled={isSubmitting || alert.isLoading}
              >
                <span className={`text-sm font-semibold ${isSelected ? 'text-white' : ''}`}>{opt.label}</span>
                <span className={`text-xs opacity-90 ${isSelected ? 'text-white opacity-80' : `text-[${COLORS.dark}]`}`}>
                  +${opt.price}
                </span>
                {isMultiSelect && isSelected && (
                  <CheckCircle size={16} className="text-white" />
                )}
              </button>
            );
          })}
          {hasError && (
              <p className="w-full mt-2 text-sm font-bold text-red-600">{errors[currentStep.key]}</p>
          )}
        </div>
      </>
    );
  };

  // --- ESTRUCTURA PRINCIPAL DEL COMPONENTE WEB ---

  return (
    <div className="flex items-center justify-center min-h-screen p-0 antialiased" style={{ backgroundColor: COLORS.background }}>
      
      <div className="relative w-full h-screen max-w-xl bg-white shadow-2xl rounded-none sm:rounded-2xl sm:h-[95vh] overflow-hidden flex flex-col">
        
        {/* Header (Simula SafeAreaView y StatusBar) */}
        <header className="flex items-center justify-between p-4 pt-8 border-b" style={{ borderColor: COLORS.lightGray, backgroundColor: COLORS.background }}>
          <button 
            className="w-8 h-8 flex items-center justify-center" 
            onClick={back} 
            disabled={isSubmitting || alert.isLoading}
            aria-label={stepIndex === 0 ? 'Salir' : 'Atrás'}
          >
            <ChevronLeft size={26} style={{ color: COLORS.dark }} />
          </button>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.dark }}>
            Diseño Personalizado
          </h1>
          <div className="w-8" />
        </header>

        {/* Stepper */}
        <div className="flex justify-center items-center px-4 py-3" style={{ backgroundColor: COLORS.background }}>
          {STEPS.map((s, i) => {
            const active = i === stepIndex;
            const completed = i < stepIndex;
            return (
              <div key={s.key} className="flex items-center">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition duration-300 ${
                    completed || active 
                      ? `bg-[${COLORS.primary}] text-white` 
                      : `bg-[${COLORS.lightGray}] text-[${COLORS.dark}]`
                  }`}
                >
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div 
                    className={`w-8 h-0.5 mx-1 transition duration-300 ${
                      completed ? `bg-[${COLORS.primary}]` : `bg-[${COLORS.lightGray}]`
                    }`} 
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Titles */}
        <div className="px-5 pt-3 pb-1" style={{ backgroundColor: COLORS.background }}>
          <h2 className="text-xl font-bold" style={{ color: COLORS.dark }}>{currentStep.title}</h2>
          <p className="text-sm opacity-85 mt-0.5" style={{ color: COLORS.dark }}>{currentStep.description}</p>
        </div>

        {/* Options / Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: COLORS.background }}>
            <div className="px-1 pb-4">
                {renderOptions()}
            </div>

            {/* Summary card */}
            <div className="mt-6 p-4 rounded-xl shadow-lg" style={{ backgroundColor: COLORS.summaryBg, borderColor: COLORS.lightGray, borderWidth: 1 }}>
                <h3 className="text-lg font-bold mb-3" style={{ color: COLORS.dark }}>Resumen de tu Diseño</h3>
                
                {/* Summary Rows */}
                <div className="space-y-1">
                    {/* Pieza */}
                    <div className="flex justify-between py-1">
                        <span className="text-sm opacity-90" style={{ color: COLORS.dark }}>Pieza</span>
                        <span className="text-sm font-bold" style={{ color: COLORS.dark }}>{selected.piece?.label || '—'}</span>
                    </div>
                    {/* Base */}
                    <div className="flex justify-between py-1">
                        <span className="text-sm opacity-90" style={{ color: COLORS.dark }}>Base</span>
                        <span className="text-sm font-bold" style={{ color: COLORS.dark }}>{selected.base?.label || '—'}</span>
                    </div>
                    {/* Longitud */}
                    <div className="flex justify-between py-1">
                        <span className="text-sm opacity-90" style={{ color: COLORS.dark }}>Longitud</span>
                        <span className="text-sm font-bold" style={{ color: COLORS.dark }}>{selected.baseLength || '—'}</span>
                    </div>
                    {/* Decoración */}
                    <div className="flex justify-between py-1">
                        <span className="text-sm opacity-90" style={{ color: COLORS.dark }}>Decoración</span>
                        <span className="text-sm font-bold text-right max-w-[60%]" style={{ color: COLORS.dark }}>
                            {selected.decoration.length > 0
                                ? selected.decoration.map(d => d.label).join(', ')
                                : '—'
                            }
                        </span>
                    </div>
                    {/* Cierre */}
                    <div className="flex justify-between py-1">
                        <span className="text-sm opacity-90" style={{ color: COLORS.dark }}>Cierre</span>
                        <span className="text-sm font-bold" style={{ color: COLORS.dark }}>{selected.clasp?.label || '—'}</span>
                    </div>
                    {/* Comentarios */}
                    {selected.customerComments && (
                      <div className="flex justify-between py-1 items-start">
                          <span className="text-sm opacity-90 pt-1" style={{ color: COLORS.dark }}>Comentarios</span>
                          <span className="text-sm italic text-right max-w-[60%]" style={{ color: COLORS.dark }}>{selected.customerComments}</span>
                      </div>
                    )}
                </div>
                
                <div className="h-px my-3" style={{ backgroundColor: COLORS.lightGray }} />
                
                {/* Precio Estimado */}
                <div className="flex justify-between py-1">
                    <span className="text-base font-bold" style={{ color: COLORS.dark }}>Precio Estimado</span>
                    <span className="text-base font-bold" style={{ color: COLORS.primary }}>${estimatedPrice.toFixed(2)} USD</span>
                </div>
            </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 p-4 border-t" style={{ backgroundColor: COLORS.background, borderColor: COLORS.lightGray }}>
          <button 
            className={`flex-1 py-3 rounded-xl text-lg font-bold transition duration-300 shadow-md ${isSubmitting || alert.isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            onClick={back}
            disabled={isSubmitting || alert.isLoading}
            style={{ backgroundColor: COLORS.lightGray, color: COLORS.dark }}
          >
            {stepIndex === 0 ? 'Salir' : 'Atrás'}
          </button>
          
          {stepIndex < STEPS.length - 1 ? (
            <button 
              className={`flex-1 py-3 rounded-xl text-lg font-bold text-white transition duration-300 shadow-md ${!canContinue || isSubmitting || alert.isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              onClick={next}
              disabled={!canContinue || isSubmitting || alert.isLoading}
              style={{ backgroundColor: COLORS.primary }}
            >
              Siguiente
            </button>
          ) : (
            <button 
              className={`flex-1 py-3 rounded-xl text-lg font-bold text-white transition duration-300 shadow-md ${!canContinue || isSubmitting || alert.isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              onClick={finish}
              disabled={!canContinue || isSubmitting || alert.isLoading}
              style={{ backgroundColor: COLORS.primary }}
            >
              {isSubmitting || alert.isLoading ? (
                <div className="flex justify-center items-center">
                    <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-2">Enviando...</span>
                </div>
              ) : (
                'Enviar Solicitud'
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Modal de Alerta/Éxito */}
      <AlertModal 
        show={alert.show}
        title={alert.title}
        message={alert.message}
        onClose={handleCloseAlert}
        isError={alert.isError}
        submitCode={alert.code}
        isLoading={alert.isLoading}
      />
    </div>
  );
}

export default CustomDesignsScreen;