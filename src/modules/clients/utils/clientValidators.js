// ============================================================================
// VALIDACIONES EN TIEMPO REAL DEL MÓDULO DE CLIENTES (COLOMBIA)
// ============================================================================

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ONLY_DIGITS_REGEX = /^\d+$/;
const LETTERS_TILDES_SPACES_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

// Dirección colombiana:
// Debe iniciar con un tipo de vía (Calle, Carrera, Avenida, Diagonal, Transversal, Circular, Autopista, Cl, Cra, Kr, Av, Dg, Tv)
// seguido de número de vía (con letras/bis opcionales), contener el símbolo de cruce (# o No.) seguido del número de cruce y placa (ej. "Calle 30 # 20-15").
const TIPO_VIA_START_REGEX =
  /^(?:calle|carrera|avenida(?:\s+(?:calle|carrera))?|diagonal|transversal|circular|autopista|cl\.?|cra\.?|kr\.?|av\.?|dg\.?|tv\.?)\s+\d+[a-zA-Z]?(?:\s+(?:bis|sur|norte|este|oeste|[a-zA-Z]))*/i;

const DIRECCION_COLOMBIA_FULL_REGEX =
  /^(?:calle|carrera|avenida(?:\s+(?:calle|carrera))?|diagonal|transversal|circular|autopista|cl\.?|cra\.?|kr\.?|av\.?|dg\.?|tv\.?)\s+\d+[a-zA-Z]?(?:\s+(?:bis|sur|norte|este|oeste|[a-zA-Z]))*\s*(?:#|no\.?|nro\.?|n°)\s*\d+[a-zA-Z]?(?:\s+(?:bis|sur|norte|este|oeste|[a-zA-Z]))*\s*(?:-\s*\d+|\s+\d+)\b/i;

export function normalizeTipoDocumento(val) {
  const upper = (val || '').toString().trim().toUpperCase();
  if (upper === 'PASAPORTE' || upper === 'PAS') {
    return 'PA';
  }
  return upper;
}

export function normalizeDocumento(val) {
  return (val || '').toString().trim();
}

export function validateTipoDocumentoCliente(tipoDoc) {
  const raw = (tipoDoc || '').toString().trim();
  if (!raw) {
    return 'El tipo de documento es obligatorio.';
  }
  const tipo = normalizeTipoDocumento(raw);
  if (tipo === 'TI') {
    return 'La Tarjeta de Identidad (TI) no está permitida. El cliente debe ser mayor de 18 años.';
  }
  if (!['CC', 'CE', 'PPT', 'PA'].includes(tipo)) {
    return 'Selecciona un tipo de documento válido.';
  }
  return '';
}

export function validateDocumento(val) {
  const raw = (val ?? '').toString().trim();
  if (!raw) {
    return 'El número de documento es obligatorio.';
  }
  if (!ONLY_DIGITS_REGEX.test(raw)) {
    return 'El documento solo debe contener números (sin letras, puntos ni espacios).';
  }
  if (raw.length < 6 || raw.length > 10) {
    return 'El documento debe tener entre 6 y 10 dígitos.';
  }
  return '';
}

export function validateNombreCompleto(val) {
  const raw = (val ?? '').toString();
  const trimmed = raw.trim();
  if (!trimmed) {
    return 'El nombre completo es obligatorio.';
  }
  if (!LETTERS_TILDES_SPACES_REGEX.test(trimmed)) {
    return 'El nombre completo solo puede contener letras, tildes, ñ y espacios.';
  }
  if (trimmed.length < 3) {
    return 'El nombre completo debe tener mínimo 3 caracteres.';
  }
  if (trimmed.length > 100) {
    return 'El nombre completo no puede superar los 100 caracteres.';
  }
  return '';
}

export function validateCorreo(val) {
  const trimmed = (val || '').toString().trim();
  if (!trimmed) {
    return 'El correo electrónico es obligatorio.';
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Ingresa un correo electrónico con formato válido (ej. usuario@dominio.com).';
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

  const parts = String(fechaStr).split('T')[0].split('-');
  const fecha =
    parts.length === 3
      ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
      : new Date(fechaStr);

  if (isNaN(fecha.getTime())) {
    return {
      isValid: false,
      error: 'La fecha de nacimiento no es válida.',
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
      error: 'La fecha de nacimiento no puede ser una fecha futura.',
      edad: null,
      label: '',
      esMayorDeEdad: false,
    };
  }

  let edad = hoySinHora.getFullYear() - fechaSinHora.getFullYear();
  const m = hoySinHora.getMonth() - fechaSinHora.getMonth();
  if (m < 0 || (m === 0 && hoySinHora.getDate() < fechaSinHora.getDate())) {
    edad--;
  }

  if (edad > 120) {
    return {
      isValid: false,
      error: 'Verifica la fecha de nacimiento ingresada.',
      edad,
      label: `${edad} años`,
      esMayorDeEdad: false,
    };
  }

  if (edad < 18) {
    return {
      isValid: false,
      error: `El cliente debe ser mayor de 18 años (edad calculada: ${edad} año${edad === 1 ? '' : 's'}).`,
      edad,
      label: `${edad} años (Menor de edad)`,
      esMayorDeEdad: false,
    };
  }

  return {
    isValid: true,
    error: '',
    edad,
    label: `${edad} años`,
    esMayorDeEdad: true,
  };
}

export function validateTelefono(val) {
  const trimmed = (val ?? '').toString().trim();
  if (!trimmed) {
    return 'El teléfono es obligatorio.';
  }
  if (!ONLY_DIGITS_REGEX.test(trimmed)) {
    return 'El teléfono solo debe contener números (sin espacios ni símbolos).';
  }
  if (!trimmed.startsWith('3')) {
    return 'El celular colombiano debe empezar por 3 (ej. 3001234567).';
  }
  if (trimmed.length !== 10) {
    return 'El teléfono celular debe tener exactamente 10 dígitos.';
  }
  return '';
}

export function validateDireccion(val) {
  const trimmed = (val ?? '').toString().trim();
  if (!trimmed) {
    return '';
  }
  if (trimmed.length < 5) {
    return 'La dirección debe tener mínimo 5 caracteres.';
  }
  if (!/\d/.test(trimmed)) {
    return 'La dirección debe incluir numeración (ej. Calle 30 # 20-15).';
  }
  if (!TIPO_VIA_START_REGEX.test(trimmed)) {
    return 'La dirección debe iniciar con un tipo de vía válido (Calle, Carrera, Avenida, Diagonal, Transversal, Circular, Autopista, Cl, Cra, Kr, Av, Dg, Tv) seguido de número.';
  }
  if (!/(?:#|no\.?|nro\.?|n°)\s*\d+/i.test(trimmed)) {
    return 'La dirección debe contener el número de cruce con "#" o "No." (ej. Calle 30 # 20-15).';
  }
  if (!DIRECCION_COLOMBIA_FULL_REGEX.test(trimmed)) {
    return 'Formato de dirección inválido. Ingresa tipo de vía, número, cruce (# o No.) y placa (ej. Calle 30 # 20-15).';
  }
  if (trimmed.length > 200) {
    return 'La dirección no puede superar los 200 caracteres.';
  }
  return '';
}
