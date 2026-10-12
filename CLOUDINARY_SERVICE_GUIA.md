# 📸 Guía de Integración: Cloudinary Service en Frontend

Este documento explica cómo funciona y cómo implementar el servicio de subida directa de imágenes a **Cloudinary** en el frontend (`web_mi_conductor1`).

---

## 1. ⚙️ Información de Configuración

Las imágenes se suben **directamente desde el cliente (navegador)** a los servidores de Cloudinary mediante un **Upload Preset No Firmado (Unsigned)**, por lo que **no se requiere intermediación del backend ni exponer claves secretas**.

- **Cloud Name**: `tsovzwez`
- **Upload Preset**: `reportes`
- **Endpoint API**: `https://api.cloudinary.com/v1_1/tsovzwez/image/upload`
- **Ubicación del Servicio en el Proyecto**: `src/services/cloudinaryService.js`

### Variables de Entorno (Opcionales en `.env`):
El servicio ya cuenta con los valores configurados por defecto como respaldo, pero en entornos de producción se pueden sobreescribir así:
```env
VITE_CLOUDINARY_CLOUD_NAME=tsovzwez
VITE_CLOUDINARY_UPLOAD_PRESET=reportes
```

---

## 2. 📁 Estructura del Servicio (`cloudinaryService.js`)

El servicio utiliza `axios` para realizar peticiones `multipart/form-data` independientes de la instancia de la API interna (para evitar enviar tokens de backend o prefijos de rutas que interfieran con Cloudinary).

### Métodos Principales

| Método | Parámetros | Retorno | Descripción |
| :--- | :--- | :--- | :--- |
| `uploadImage(file, options)` | `file` (File, Blob, Base64), `options` (Objeto opcional) | `Promise<Object>` | Sube una imagen individual y retorna su URL segura (`secure_url`) y metadatos. |
| `uploadMultipleImages(files, options)` | `files` (Array de File/Blob), `options` (Objeto opcional) | `Promise<Array>` | Sube múltiples imágenes en paralelo mediante `Promise.all`. |
| `getConfig()` | Ninguno | `Object` | Retorna las credenciales activas del servicio. |

### Objeto de Retorno al Subir una Imagen:
```json
{
  "secure_url": "https://res.cloudinary.com/tsovzwez/image/upload/v1791835894/sample.png",
  "url": "http://res.cloudinary.com/tsovzwez/image/upload/v1791835894/sample.png",
  "public_id": "h2tikc9hz2pyfylreryg",
  "format": "png",
  "width": 1200,
  "height": 800,
  "bytes": 105420,
  "original_filename": "mi_foto"
}
```

---

## 3. 🚀 Guía de Uso Paso a Paso

### Paso 1: Importar el Servicio
```javascript
import CloudinaryService from '@/services/cloudinaryService';
// O con ruta relativa:
// import CloudinaryService from '../../../services/cloudinaryService';
```

---

### Paso 2: Subir una Imagen Individual (Ej. Foto de Perfil o Conductor)

```javascript
import { useState } from 'react';
import CloudinaryService from '@/services/cloudinaryService';

function UploadAvatarExample() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Vista previa instantánea
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);

      // Subir archivo a Cloudinary especificando carpeta opcional
      const result = await CloudinaryService.uploadImage(selectedFile, {
        folder: 'conductores/perfiles'
      });

      console.log('Imagen subida con éxito:', result.secure_url);
      
      // Enviar la URL al backend
      // await axiosInstance.post('/usuarios/perfil', { foto: result.secure_url });

    } catch (error) {
      console.error('Error al subir:', error.message);
      alert('No se pudo subir la imagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" width={100} />}
      <button onClick={handleSave} disabled={loading}>
        {loading ? 'Subiendo a Cloudinary...' : 'Guardar'}
      </button>
    </div>
  );
}
```

---

### Paso 3: Subida de Múltiples Imágenes (Implementado en Módulo Vehículos)

En `VehicleFormPage.jsx`, la subida se procesa al momento de enviar el formulario. Los archivos seleccionados (`tarjetaPropiedadFile`, `foto1`, `foto2`, `foto3`) se suben a Cloudinary y sus `secure_url` se guardan en la base de datos de MongoDB:

```javascript
// Ejemplo del flujo en VehicleFormPage.jsx
try {
  setIsSubmitting(true);
  setUploadStatus('Subiendo imágenes a Cloudinary...');

  let finalTarjeta = rawVehicle?.tarjetaPropiedad || null;
  if (tarjetaPropiedadFile?.file) {
    const res = await CloudinaryService.uploadImage(tarjetaPropiedadFile.file, {
      folder: 'vehiculos/documentos'
    });
    finalTarjeta = res.secure_url;
  }

  let finalFoto1 = rawVehicle?.foto1 || null;
  if (foto1?.file) {
    const res1 = await CloudinaryService.uploadImage(foto1.file, {
      folder: 'vehiculos/fotos'
    });
    finalFoto1 = res1.secure_url;
  }

  let finalFoto2 = rawVehicle?.foto2 || null;
  if (foto2?.file) {
    const res2 = await CloudinaryService.uploadImage(foto2.file, {
      folder: 'vehiculos/fotos'
    });
    finalFoto2 = res2.secure_url;
  }

  let finalFoto3 = rawVehicle?.foto3 || null;
  if (foto3?.file) {
    const res3 = await CloudinaryService.uploadImage(foto3.file, {
      folder: 'vehiculos/fotos'
    });
    finalFoto3 = res3.secure_url;
  }

  const allFotos = [finalFoto1, finalFoto2, finalFoto3].filter(Boolean);

  // Armar el payload con URLs permanentes de Cloudinary
  const payload = {
    ...formData,
    tarjetaPropiedad: finalTarjeta,
    foto1: finalFoto1,
    foto2: finalFoto2,
    foto3: finalFoto3,
    foto: finalFoto1 || allFotos[0] || null,
    fotos: allFotos
  };

  // Guardar en el backend
  await VehiculoService.create(payload);

} finally {
  setIsSubmitting(false);
}
```

---

## 4. 💡 Buenas Prácticas para el Equipo

1. **Solo Archivos de Imagen**:
   - Usar en los inputs o Dropzones: `accept="image/png, image/jpeg, image/webp"`.
   - El preset `reportes` está optimizado para endpoints de imágenes.
2. **Organización por Carpetas**:
   - Utilizar el parámetro `{ folder: 'nombre_modulo/seccion' }` al invocar `uploadImage`. Esto mantiene organizado el almacenamiento en Cloudinary.
3. **No Duplicar Subidas**:
   - Si una imagen ya es una URL remota (empieza por `http://` o `https://`), el servicio no la vuelve a subir y retorna la misma URL.
4. **Retroalimentación Visual**:
   - Siempre mostrar un estado de carga claro (`isSubmitting` / Spinner / "Subiendo a Cloudinary...") para que el usuario no cierre la ventana mientras se transfieren las imágenes.

---

## 5. 🛠️ Prueba Rápida en Terminal / Consola

Para verificar que el servicio y las credenciales sigan funcionando en cualquier momento:

```powershell
powershell -Command "Invoke-RestMethod -Uri 'https://api.cloudinary.com/v1_1/tsovzwez/image/upload' -Method Post -Body @{ upload_preset = 'reportes'; file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }"
```
Si retorna HTTP 200 con `secure_url`, Cloudinary está listo y operativo.
