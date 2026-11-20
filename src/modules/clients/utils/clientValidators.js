import {
  NAME_REGEX,
  ONLY_DIGITS_REGEX,
  validateDocumento,
  validateCorreo,
  normalizeTipoDocumento,
  normalizeDocumento,
} from '../../../utils/validators.js';

export {
  validateDocumento,
  validateCorreo,
  normalizeTipoDocumento,
  normalizeDocumento,
};

export function validateNombreCompleto(val) {
  const trimmed = (val || '').toString().trim();
  if (!trimmed) {
    return 'El nombre completo es obligatorio.';
  }
  if (!NAME_REGEX.test(trimmed)) {
    return 'El nombre solo puede contener letras y espacios, sin números ni símbolos especiales.';
  }
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    return 'Por favor ingresa nombre y apellido completo (mínimo dos palabras).';
  }
  if (trimmed.length < 3 || trimmed.length > 100) {
    return 'El nombre debe tener entre 3 y 100 caracteres.';
  }
  return '';
}

export function validateTelefono(val) {
  const trimmed = (val || '').toString().trim().replace(/[\s-]/g, '');
  if (!trimmed) {
    return 'El número de teléfono es obligatorio.';
  }
  if (!ONLY_DIGITS_REGEX.test(trimmed)) {
    return 'El teléfono solo debe contener números, sin letras ni caracteres especiales.';
  }
  if (trimmed.length < 7 || trimmed.length > 10) {
    return 'El teléfono debe tener entre 7 y 10 dígitos.';
  }
  if (trimmed.length === 10 && !trimmed.startsWith('3')) {
    return 'Los números celulares en Colombia deben comenzar por 3 (ej: 3001234567).';
  }
  return '';
}

export function validateDireccion(val) {
  const trimmed = (val || '').toString().trim();
  if (!trimmed) {
    return 'La dirección es obligatoria.';
  }
  if (trimmed.length < 5) {
    return 'La dirección debe tener al menos 5 caracteres (ej. Calle 100 # 15-20).';
  }
  if (trimmed.length > 200) {
    return 'La dirección no puede superar los 200 caracteres.';
  }
  return '';
}

export function validateFechaNacimientoYEdad(fechaStr) {
  if (!fechaStr) {
    return {
      isValid: false,
      error: 'La fecha de nacimiento es obligatoria.',
      edad: null,
      label: '',
      esMayorDeEdad: false,
    };
  }

  const fecha = new Date(fechaStr);
  if (isNaN(fecha.getTime())) {
    return {
      isValid: false,
      error: 'Fecha de nacimiento inválida.',
      edad: null,
      label: '',
      esMayorDeEdad: false,
    };
  }

  const hoy = new Date();
  const fechaSinHora = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  if (fechaSinHora > hoySinHora) {
    return {
      isValid: false,
      error: 'La fecha de nacimiento no puede ser futura.',
      edad: null,
      label: '',
      esMayorDeEdad: false,
    };
  }

  let edad = hoy.getFullYear() - fecha.getFullYear();
  const m = hoy.getMonth() - fecha.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }

  if (edad > 120) {
    return {
      isValid: false,
      error: 'Verifica la fecha de nacimiento ingresada.',
      edad,
      label: `${edad} años`,
      esMayorDeEdad: true,
    };
  }

  if (edad < 18) {
    return {
      isValid: false,
      error: `El cliente debe ser mayor de edad (mínimo 18 años). La edad actual es de ${edad} año${edad === 1 ? '' : 's'}.`,
      edad,
      label: `${edad} años (Menor de edad)`,
      esMayorDeEdad: false,
    };
  }

  return {
    isValid: true,
    error: '',
    edad,
    label: `${edad} años (Mayor de edad)`,
    esMayorDeEdad: true,
  };
}

export function validateTipoDocumentoCliente(tipoDoc) {
  const tipo = normalizeTipoDocumento(tipoDoc);
  if (!tipo) {
    return 'Selecciona un tipo de documento.';
  }
  if (tipo === 'TI') {
    return 'La Tarjeta de Identidad (TI) es exclusiva para menores de edad. Para clientes mayores de edad debe seleccionar Cédula de Ciudadanía (CC), Cédula de Extranjería (CE) o Pasaporte.';
  }
  if (!['CC', 'CE', 'PPT', 'PA'].includes(tipo)) {
    return 'Tipo de documento no válido para clientes. Debe ser CC, CE, PPT o Pasaporte.';
  }
  return '';
}
