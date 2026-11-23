import axios from 'axios';

/**
 * Configuración de Cloudinary
 * Permite usar variables de entorno con fallback a las credenciales configuradas.
 */
const CLOUD_NAME = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME || 'tsovzwez';
const UPLOAD_PRESET = import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET || 'reportes';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Servicio para la gestión y carga de imágenes a Cloudinary directamente desde el frontend.
 */
class CloudinaryService {
  /**
   * Sube una sola imagen a Cloudinary usando el preset no firmado (unsigned).
   * 
   * @param {File|Blob|string} file - Archivo de imagen a subir (File, Blob o data URL base64).
   * @param {Object} [options={}] - Opciones adicionales.
   * @param {string} [options.folder] - Carpeta opcional en Cloudinary (ej: 'vehiculos', 'conductores').
   * @param {Function} [options.onUploadProgress] - Callback para seguimiento del progreso: ({ percent, loaded, total }).
   * @returns {Promise<{ secure_url: string, public_id: string, format: string, width: number, height: number, bytes: number }>}
   */
  async uploadImage(file, options = {}) {
    if (!file) {
      throw new Error('No se proporcionó ningún archivo para subir a Cloudinary.');
    }

    // Si ya es una URL remota de Cloudinary o de internet, la retornamos directamente
    if (typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://'))) {
      return { secure_url: file, public_id: '', format: '', width: 0, height: 0, bytes: 0 };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', options.uploadPreset || UPLOAD_PRESET);

    if (options.folder) {
      formData.append('folder', options.folder);
    }

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (options.onUploadProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            options.onUploadProgress({ percent, loaded: progressEvent.loaded, total: progressEvent.total });
          }
        },
      });

      const data = response.data;
      return {
        secure_url: data.secure_url,
        url: data.url,
        public_id: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes,
        original_filename: data.original_filename,
      };
    } catch (error) {
      const serverMessage = error.response?.data?.error?.message;
      const errorMessage = serverMessage
        ? `Error de Cloudinary: ${serverMessage}`
        : (error.message || 'Error al subir la imagen a Cloudinary');
      console.error('CloudinaryService uploadImage error:', errorMessage, error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Sube múltiples imágenes en paralelo a Cloudinary.
   * 
   * @param {Array<File|Blob|string>} files - Lista de archivos a subir.
   * @param {Object} [options={}] - Opciones adicionales (ej: folder).
   * @returns {Promise<Array<{ secure_url: string, public_id: string }>>}
   */
  async uploadMultipleImages(files, options = {}) {
    if (!Array.isArray(files) || files.length === 0) {
      return [];
    }

    const validFiles = files.filter(Boolean);
    const uploadPromises = validFiles.map((file) => this.uploadImage(file, options));
    return Promise.all(uploadPromises);
  }

  /**
   * Obtiene la configuración actual utilizada por el servicio.
   */
  getConfig() {
    return {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
      uploadUrl: CLOUDINARY_UPLOAD_URL,
    };
  }
}

const cloudinaryServiceInstance = new CloudinaryService();
export default cloudinaryServiceInstance;
export { CloudinaryService };
