// ============================================================================
// VALIDACIONES COMPARTIDAS DE AUTENTICACIÓN Y REGISTRO — MI CONDUCTOR
// ============================================================================
//
// Reglas documentadas por tipo de documento en Colombia:
// 1. CC (Cédula de ciudadanía - Registraduría Nacional / PILA Res. 2388 de 2016):
//    - Solo dígitos numéricos (0-9), sin letras, espacios ni caracteres especiales.
//    - Longitud: entre 6 y 10 dígitos (cédulas históricas de 6-8 dígitos y NUIP de 10 dígitos).
// 2. TI (Tarjeta de identidad - Registraduría Nacional / Decreto 412 de 2000):
//    - Solo dígitos numéricos (0-9), sin letras, espacios ni caracteres especiales.
//    - Longitud: entre 10 y 11 dígitos (NUIP actual de 10 dígitos y formato anterior de 11 dígitos).
// 3. CE (Cédula de extranjería - Migración Colombia / PILA Res. 2388 de 2016 y Res. 1529):
//    - Solo dígitos numéricos (0-9), sin letras, espacios ni caracteres especiales.
//    - Longitud: entre 6 y 7 dígitos.
// 4. PPT (Permiso por Protección Temporal - Migración Colombia Decreto 216 de 2021 /
//    MinSalud Res. 1178 de 2021, Res. 572 de 2022 y Res. 2012 de 2022):
//    - Solo dígitos numéricos (0-9), sin letras, espacios ni caracteres especiales.
//    - Longitud: entre 6 y 8 dígitos.
// 5. PA / Pasaporte (OACI Doc 9303 / MinSalud Res. 2388 de 2016):
//    - Alfanumérico (letras A-Z y números 0-9), sin espacios internos ni caracteres especiales.
//    - No exige exclusivamente números. Se normaliza en mayúsculas.
//    - Longitud: entre 6 y 16 caracteres.
// ============================================================================

export const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const ONLY_DIGITS_REGEX = /^\d+$/
export const ALPHANUMERIC_REGEX = /^[0-9A-Za-z]+$/
export const CELULAR_COLOMBIA_REGEX = /^3\d{9}$/
export const PASSWORD_UPPER_REGEX = /[A-ZÁÉÍÓÚÑ]/
export const PASSWORD_LOWER_REGEX = /[a-záéíóúñ]/
export const PASSWORD_NUMBER_REGEX = /\d/
export const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~¡¿]/

const TIPO_VIA_START_REGEX =
    /^(?:calle|carrera|avenida(?:\s+(?:calle|carrera))?|diagonal|transversal|circular|autopista|cl\.?|cra\.?|kr\.?|av\.?|dg\.?|tv\.?)\s+\d+[a-zA-Z]?(?:\s+(?:bis|sur|norte|este|oeste|[a-zA-Z]))*/i
const DIRECCION_COLOMBIA_FULL_REGEX =
    /^(?:calle|carrera|avenida(?:\s+(?:calle|carrera))?|diagonal|transversal|circular|autopista|cl\.?|cra\.?|kr\.?|av\.?|dg\.?|tv\.?)\s+\d+[a-zA-Z]?(?:\s+(?:bis|sur|norte|este|oeste|[a-zA-Z]))*\s*(?:#|no\.?|nro\.?|n°)\s*\d+[a-zA-Z]?(?:\s+(?:bis|sur|norte|este|oeste|[a-zA-Z]))*\s*(?:-\s*\d+|\s+\d+)\b/i

export const FIELD_LIMITS = {
    nombre: { min: 2, max: 50 },
    apellido: { min: 2, max: 50 },
    correo: { min: 5, max: 100 },
    telefono: { min: 10, max: 10 },
    direccion: { min: 5, max: 120 },
    password: { min: 8, max: 64 }
}

export const ALLOWED_DOCUMENT_TYPES = ['CC', 'TI', 'CE', 'PPT', 'PA']

export const DOCUMENT_TYPE_OPTIONS = [
    { value: 'CC', label: 'CC — Cédula de ciudadanía' },
    { value: 'TI', label: 'TI — Tarjeta de identidad' },
    { value: 'CE', label: 'CE — Cédula de extranjería' },
    { value: 'PPT', label: 'PPT — Permiso por Protección Temporal' },
    { value: 'PA', label: 'Pasaporte' }
]

export const CLIENT_DOCUMENT_TYPE_OPTIONS = [
    { value: 'CC', label: 'CC — Cédula de ciudadanía' },
    { value: 'CE', label: 'CE — Cédula de extranjería' },
    { value: 'PPT', label: 'PPT — Permiso Protección Temporal' },
    { value: 'PA', label: 'PA — Pasaporte' }
]

export const DOCUMENT_RULES = {
    CC: {
        label: 'La Cédula de ciudadanía (CC)',
        numericOnly: true,
        minLength: 6,
        maxLength: 10,
        regex: ONLY_DIGITS_REGEX,
        charError: 'La Cédula de ciudadanía (CC) solo debe contener números, sin letras, espacios ni caracteres especiales.',
        lengthError: 'La Cédula de ciudadanía (CC) debe tener entre 6 y 10 dígitos.'
    },
    TI: {
        label: 'La Tarjeta de identidad (TI)',
        numericOnly: true,
        minLength: 10,
        maxLength: 11,
        regex: ONLY_DIGITS_REGEX,
        charError: 'La Tarjeta de identidad (TI) solo debe contener números, sin letras, espacios ni caracteres especiales.',
        lengthError: 'La Tarjeta de identidad (TI) debe tener entre 10 y 11 dígitos.'
    },
    CE: {
        label: 'La Cédula de extranjería (CE)',
        numericOnly: true,
        minLength: 6,
        maxLength: 7,
        regex: ONLY_DIGITS_REGEX,
        charError: 'La Cédula de extranjería (CE) solo debe contener números, sin letras, espacios ni caracteres especiales.',
        lengthError: 'La Cédula de extranjería (CE) debe tener entre 6 y 7 dígitos.'
    },
    PPT: {
        label: 'El Permiso por Protección Temporal (PPT)',
        numericOnly: true,
        minLength: 6,
        maxLength: 8,
        regex: ONLY_DIGITS_REGEX,
        charError: 'El Permiso por Protección Temporal (PPT) solo debe contener números, sin letras, espacios ni caracteres especiales.',
        lengthError: 'El Permiso por Protección Temporal (PPT) debe tener entre 6 y 8 dígitos.'
    },
    PA: {
        label: 'El Pasaporte',
        numericOnly: false,
        minLength: 6,
        maxLength: 16,
        regex: ALPHANUMERIC_REGEX,
        charError: 'El Pasaporte solo puede contener letras y números, sin espacios ni caracteres especiales.',
        lengthError: 'El Pasaporte debe tener entre 6 y 16 caracteres alfanuméricos.'
    }
}

export function normalizeTipoDocumento(val) {
    const upper = (val || '').toString().trim().toUpperCase()
    if (upper === 'PASAPORTE' || upper === 'PAS') {
        return 'PA'
    }
    return upper
}

export function normalizeDocumento(val, tipoDoc = 'CC') {
    const trimmed = (val || '').toString().trim()
    const tipo = normalizeTipoDocumento(tipoDoc)
    if (tipo === 'PA') {
        return trimmed.toUpperCase()
    }
    return trimmed
}

export function validateTipoDocumento(val) {
    const normalized = normalizeTipoDocumento(val)
    if (!normalized) {
        return 'Selecciona un tipo de documento.'
    }
    if (!ALLOWED_DOCUMENT_TYPES.includes(normalized)) {
        return 'Tipo de documento no válido. Debe ser CC, TI, CE, PPT o Pasaporte.'
    }
    return ''
}

export function validateDocumento(val, tipoDoc = 'CC') {
    const raw = (val ?? '').toString()
    const trimmed = raw.trim()

    if (!trimmed) {
        return 'El número de documento es obligatorio.'
    }

    const tipoError = validateTipoDocumento(tipoDoc)
    if (tipoError) {
        return tipoError
    }

    const tipo = normalizeTipoDocumento(tipoDoc)
    const rule = DOCUMENT_RULES[tipo]

    if (!rule) {
        return 'Tipo de documento no válido.'
    }

    // Validar caracteres permitidos (rechazar espacios internos, letras en numéricos o caracteres especiales)
    if (!rule.regex.test(trimmed)) {
        return rule.charError
    }

    // Validar longitud específica según el tipo de documento
    if (trimmed.length < rule.minLength || trimmed.length > rule.maxLength) {
        return rule.lengthError
    }

    return ''
}

export function validateCorreo(val) {
    const trimmed = (val || '').toString().trim()
    if (!trimmed) {
        return 'El correo electrónico es obligatorio.'
    }
    if (trimmed.length > FIELD_LIMITS.correo.max) {
        return `El correo no puede superar los ${FIELD_LIMITS.correo.max} caracteres.`
    }
    if (!EMAIL_REGEX.test(trimmed)) {
        return 'Ingresa un correo electrónico válido.'
    }
    return ''
}

export function getTodayIsoDate() {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

export function validateFechaNacimiento(val) {
    const clean = (val || '').toString().trim()
    if (!clean) {
        return 'La fecha de nacimiento es obligatoria.'
    }
    const parts = clean.split('T')[0].split('-')
    if (parts.length !== 3) {
        return 'Ingresa una fecha de nacimiento válida.'
    }
    const y = Number(parts[0])
    const m = Number(parts[1])
    const d = Number(parts[2])
    const fecha = new Date(y, m - 1, d)
    if (
        isNaN(fecha.getTime()) ||
        fecha.getFullYear() !== y ||
        fecha.getMonth() !== m - 1 ||
        fecha.getDate() !== d
    ) {
        return 'La fecha de nacimiento no es válida.'
    }

    const hoy = new Date()
    const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    const fechaSinHora = new Date(y, m - 1, d)

    if (fechaSinHora > hoySinHora) {
        return 'La fecha de nacimiento no puede ser futura.'
    }

    let edad = hoySinHora.getFullYear() - fechaSinHora.getFullYear()
    const diffMes = hoySinHora.getMonth() - fechaSinHora.getMonth()
    if (diffMes < 0 || (diffMes === 0 && hoySinHora.getDate() < fechaSinHora.getDate())) {
        edad--
    }

    if (edad > 120) {
        return 'La fecha de nacimiento no es válida.'
    }
    if (edad < 18) {
        return `Debes ser mayor de 18 años para registrarte (edad actual: ${edad} años).`
    }
    return ''
}

export function validateTelefonoColombiano(val) {
    const trimmed = (val || '').toString().trim()
    if (!trimmed) {
        return 'El teléfono es obligatorio.'
    }
    if (!ONLY_DIGITS_REGEX.test(trimmed)) {
        return 'El teléfono solo debe contener números.'
    }
    if (!CELULAR_COLOMBIA_REGEX.test(trimmed)) {
        return 'Ingresa un celular colombiano de 10 dígitos que empiece por 3.'
    }
    return ''
}

export function validateDireccionColombiana(val) {
    const trimmed = (val || '').toString().trim()
    if (!trimmed) {
        return 'La dirección es obligatoria.'
    }
    if (trimmed.length < FIELD_LIMITS.direccion.min) {
        return `La dirección debe tener al menos ${FIELD_LIMITS.direccion.min} caracteres.`
    }
    if (trimmed.length > FIELD_LIMITS.direccion.max) {
        return `La dirección no puede superar los ${FIELD_LIMITS.direccion.max} caracteres.`
    }
    if (!TIPO_VIA_START_REGEX.test(trimmed) || !DIRECCION_COLOMBIA_FULL_REGEX.test(trimmed)) {
        return 'Formato inválido (ej: Calle 10 # 20-30).'
    }
    return ''
}

export function getPasswordRequirements(val) {
    const pwd = typeof val === 'string' ? val : ''
    return [
        { id: 'length', label: '8+ caracteres', valid: pwd.length >= FIELD_LIMITS.password.min && pwd.length <= FIELD_LIMITS.password.max },
        { id: 'uppercase', label: 'Una mayúscula', valid: PASSWORD_UPPER_REGEX.test(pwd) },
        { id: 'lowercase', label: 'Una minúscula', valid: PASSWORD_LOWER_REGEX.test(pwd) },
        { id: 'number', label: 'Un número', valid: PASSWORD_NUMBER_REGEX.test(pwd) },
        { id: 'special', label: 'Carácter especial', valid: PASSWORD_SPECIAL_REGEX.test(pwd) }
    ]
}

export function validateRegistrationPassword(val) {
    if (!val || typeof val !== 'string' || val.length === 0) {
        return 'La contraseña es obligatoria.'
    }
    if (/\s/.test(val)) {
        return 'La contraseña no puede contener espacios.'
    }
    if (val.length < FIELD_LIMITS.password.min) {
        return `La contraseña debe tener al menos ${FIELD_LIMITS.password.min} caracteres.`
    }
    if (val.length > FIELD_LIMITS.password.max) {
        return `La contraseña no puede superar los ${FIELD_LIMITS.password.max} caracteres.`
    }
    if (!PASSWORD_UPPER_REGEX.test(val)) {
        return 'Debe incluir al menos una letra mayúscula.'
    }
    if (!PASSWORD_LOWER_REGEX.test(val)) {
        return 'Debe incluir al menos una letra minúscula.'
    }
    if (!PASSWORD_NUMBER_REGEX.test(val)) {
        return 'Debe incluir al menos un número.'
    }
    if (!PASSWORD_SPECIAL_REGEX.test(val)) {
        return 'Debe incluir al menos un carácter especial.'
    }
    return ''
}

export function validatePassword(val) {
    if (!val || typeof val !== 'string' || val.length === 0) {
        return 'La contraseña es obligatoria.'
    }
    if (!val.trim()) {
        return 'La contraseña no puede estar compuesta solo por espacios.'
    }
    if (val.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres.'
    }
    return ''
}

