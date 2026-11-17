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

export const ALLOWED_DOCUMENT_TYPES = ['CC', 'TI', 'CE', 'PPT', 'PA']

export const DOCUMENT_TYPE_OPTIONS = [
    { value: 'CC', label: 'CC — Cédula de ciudadanía' },
    { value: 'TI', label: 'TI — Tarjeta de identidad' },
    { value: 'CE', label: 'CE — Cédula de extranjería' },
    { value: 'PPT', label: 'PPT — Permiso por Protección Temporal' },
    { value: 'PA', label: 'Pasaporte' }
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
    if (!EMAIL_REGEX.test(trimmed)) {
        return 'Ingresa un correo electrónico válido.'
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

export function validateNombreCompleto(val) {
    const trimmed = (val || '').toString().trim()
    if (!trimmed) {
        return 'El nombre completo es obligatorio.'
    }
    if (!NAME_REGEX.test(trimmed)) {
        return 'El nombre solo puede contener letras y espacios, sin números ni símbolos especiales.'
    }
    const words = trimmed.split(/\s+/).filter(Boolean)
    if (words.length < 2) {
        return 'Por favor ingresa nombre y apellido completo (mínimo dos palabras).'
    }
    if (trimmed.length < 3 || trimmed.length > 100) {
        return 'El nombre debe tener entre 3 y 100 caracteres.'
    }
    return ''
}

export function validateTelefono(val) {
    const trimmed = (val || '').toString().trim().replace(/[\s-]/g, '')
    if (!trimmed) {
        return 'El número de teléfono es obligatorio.'
    }
    if (!ONLY_DIGITS_REGEX.test(trimmed)) {
        return 'El teléfono solo debe contener números, sin letras ni caracteres especiales.'
    }
    if (trimmed.length < 7 || trimmed.length > 10) {
        return 'El teléfono debe tener entre 7 y 10 dígitos.'
    }
    if (trimmed.length === 10 && !trimmed.startsWith('3')) {
        return 'Los números celulares en Colombia deben comenzar por 3 (ej: 3001234567).'
    }
    return ''
}

export function validateDireccion(val) {
    const trimmed = (val || '').toString().trim()
    if (!trimmed) {
        return 'La dirección es obligatoria.'
    }
    if (trimmed.length < 5) {
        return 'La dirección debe tener al menos 5 caracteres (ej. Calle 100 # 15-20).'
    }
    if (trimmed.length > 200) {
        return 'La dirección no puede superar los 200 caracteres.'
    }
    return ''
}

export function validateFechaNacimientoYEdad(fechaStr) {
    if (!fechaStr) {
        return {
            isValid: false,
            error: 'La fecha de nacimiento es obligatoria.',
            edad: null,
            label: '',
            esMayorDeEdad: false
        }
    }

    const fecha = new Date(fechaStr)
    if (isNaN(fecha.getTime())) {
        return {
            isValid: false,
            error: 'Fecha de nacimiento inválida.',
            edad: null,
            label: '',
            esMayorDeEdad: false
        }
    }

    const hoy = new Date()
    // Normalizar a inicio de día
    const fechaSinHora = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
    const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())

    if (fechaSinHora > hoySinHora) {
        return {
            isValid: false,
            error: 'La fecha de nacimiento no puede ser futura.',
            edad: null,
            label: '',
            esMayorDeEdad: false
        }
    }

    let edad = hoy.getFullYear() - fecha.getFullYear()
    const m = hoy.getMonth() - fecha.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
        edad--
    }

    if (edad > 120) {
        return {
            isValid: false,
            error: 'Verifica la fecha de nacimiento ingresada.',
            edad,
            label: `${edad} años`,
            esMayorDeEdad: true
        }
    }

    if (edad < 18) {
        return {
            isValid: false,
            error: `El cliente debe ser mayor de edad (mínimo 18 años). La edad actual es de ${edad} año${edad === 1 ? '' : 's'}.`,
            edad,
            label: `${edad} años (Menor de edad)`,
            esMayorDeEdad: false
        }
    }

    return {
        isValid: true,
        error: '',
        edad,
        label: `${edad} años (Mayor de edad)`,
        esMayorDeEdad: true
    }
}

export function validateTipoDocumentoCliente(tipoDoc) {
    const tipo = normalizeTipoDocumento(tipoDoc)
    if (!tipo) {
        return 'Selecciona un tipo de documento.'
    }
    if (tipo === 'TI') {
        return 'La Tarjeta de Identidad (TI) es exclusiva para menores de edad. Para clientes mayores de edad debe seleccionar Cédula de Ciudadanía (CC), Cédula de Extranjería (CE) o Pasaporte.'
    }
    if (!['CC', 'CE', 'PPT', 'PA'].includes(tipo)) {
        return 'Tipo de documento no válido para clientes. Debe ser CC, CE, PPT o Pasaporte.'
    }
    return ''
}


