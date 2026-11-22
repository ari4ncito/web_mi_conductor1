import LegalPageLayout from '../components/LegalPageLayout';

export default function PoliticaPrivacidadPage() {
  return (
    <LegalPageLayout
      title="Política de Privacidad de datos"
      subtitle="Tratamiento, recolección, uso, seguridad y ejercicio de derechos sobre datos personales en la plataforma Mi Conductor."
      lastUpdated="20 de noviembre de 2026"
    >
      <div className="space-y-10 text-sm sm:text-base leading-relaxed">

        {/* Aviso de Borrador y Marco Normativo */}
        <div className="bg-amber-50 border-l-4 border-accent p-4 rounded-r-xl text-amber-900 text-xs sm:text-sm">
          <strong>Marco normativo aplicable:</strong> Esta Política de Tratamiento de Información se formula con sujeción estricta
          al artículo 15 de la Constitución Política de Colombia, la Ley Estatutaria 1581 de 2012 y el Decreto Reglamentario 1074 de 2015
          (Capítulo 25). Constituye un borrador sujeto a revisión jurídica previa a su registro oficial.
        </div>

        {/* 1. Responsable del Tratamiento */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            1. Identificación del Responsable del Tratamiento
          </h2>
          <p>
            El responsable del tratamiento de los datos personales captados a través de la plataforma <strong>Mi Conductor</strong> es:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li><strong>Nombre comercial:</strong> Go Driver</li>
            <li><strong>Razón social:</strong> [PENDIENTE DE DEFINICIÓN POR GO DRIVER]</li>
            <li><strong>NIT:</strong> [PENDIENTE DE DEFINICIÓN POR GO DRIVER]</li>
            <li><strong>Domicilio:</strong> Cartagena de Indias, Barrio Prado, Colombia</li>
            <li><strong>Teléfono de contacto:</strong> 314 543 9798</li>
            <li><strong>Canal exclusivo para Habeas Data y Privacidad:</strong> miconductor2025@gmail.com</li>
          </ul>
        </section>

        {/* 2. Información Personal Recopilada */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            2. Información Personal y Categorías de Datos Recopilados
          </h2>
          <p>
            En función del rol de usuario (Cliente, Conductor o Administrador) y de los servicios requeridos, Mi Conductor puede
            recopilar las siguientes categorías de datos:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li><strong>Datos de identificación y contacto:</strong> Tipo y número de documento (CC, CE, Pasaporte, etc.), nombres y apellidos, dirección de correo electrónico y número telefónico.</li>
            <li><strong>Datos de conductores:</strong> Copia, número y categoría de la licencia de conducción, fecha de vigencia y estado administrativo/disponibilidad.</li>
            <li><strong>Datos vehiculares:</strong> Marca, modelo, placa, color, número de chasis, imágenes del vehículo y copia o vigencia de documentos legales (SOAT y revisión técnico-mecánica).</li>
            <li><strong>Datos de solicitudes y ejecución:</strong> Puntos de origen y destino del traslado, fecha y hora programada, incidencias y observaciones del servicio.</li>
            <li><strong>Registros fotográficos y evidencias:</strong> Fotografías de inspección física antes del traslado y fotografías aportadas en reportes de novedades en carretera.</li>
            <li><strong>Datos de ubicación para visualización de ruta:</strong> Coordenadas y trazado de ruta empleados exclusivamente para el seguimiento y visualización del traslado.</li>
            <li><strong>Datos de evaluación:</strong> Puntuaciones numéricas (de 1 a 5 estrellas) y comentarios sobre la calidad del servicio.</li>
          </ul>
        </section>

        {/* 3. Finalidades del Tratamiento */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            3. Finalidades del Tratamiento de Datos
          </h2>
          <p>Los datos personales recolectados serán tratados para las siguientes finalidades legítimas y explícitas:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>Creación, autenticación, perfilamiento y administración segura de las cuentas de usuario.</li>
            <li>Gestión y verificación de requisitos legales de clientes, conductores y vehículos registrados.</li>
            <li>Recepción, procesamiento, cotización y despacho de solicitudes de conducción.</li>
            <li>Asignación de conductores calificados en función de disponibilidad y categoría de licencia.</li>
            <li>Visualización de la ruta del traslado vehicular entre el origen y el destino.</li>
            <li>Documentación del estado del automotor mediante registro fotográfico antes y durante el servicio.</li>
            <li>Recepción y gestión de novedades (tráfico, accidentes o fallas) para prestar soporte inmediato.</li>
            <li>Envío de notificaciones transaccionales y de servicio al cliente, conductor o administrador.</li>
            <li>Procesamiento de calificaciones y retroalimentación para alimentar los indicadores de calidad.</li>
            <li>Generación de reportes administrativos y analítica de desempeño operativa interna.</li>
            <li>Atención oportuna de consultas, peticiones, quejas y reclamos (PQRSF).</li>
          </ul>
        </section>

        {/* 4. Tratamiento Específico de Ubicación y Visualización de Ruta */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            4. Tratamiento de Datos de Ubicación y Visualización de Ruta
          </h2>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-slate-700">
            <p>
              El uso de coordenadas para la visualización de la ruta responde estrictamente a la necesidad operativa de
              mostrar el recorrido entre el origen y el destino a las partes involucradas.
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1 text-slate-600">
              <li><strong>Temporalidad:</strong> La información de ruta se consulta únicamente durante la vigencia activa del servicio solicitado.</li>
              <li><strong>No monitoreo permanente:</strong> La plataforma no efectúa rastreo permanente ni continuo fuera de los servicios activos.</li>
              <li><strong>Acceso restringido:</strong> Únicamente el Cliente solicitante, el Conductor asignado y el Administrador cuentan con visibilidad del trayecto.</li>
            </ul>
          </div>
        </section>

        {/* 5. Tratamiento de Fotografías y Evidencias */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            5. Tratamiento de Registros Fotográficos y Evidencias
          </h2>
          <p>
            Las fotografías captadas antes del viaje (inspección de estado) o durante el traslado (reporte de novedades)
            tienen como único fin garantizar la trazabilidad física del automotor, respaldar el inventario de entrega y sustentar
            cualquier reclamación por afectaciones mecánicas o de latonería. Se almacenan de forma protegida y no se emplean para
            fines comerciales no autorizados.
          </p>
        </section>

        {/* 6. Autorización del Titular */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            6. Autorización Previa, Expresa e Informada
          </h2>
          <p>
            Go Driver recaba la autorización previa, expresa e informada del titular al momento del registro en la plataforma,
            mediante casillas de verificación independientes que garantizan que el consentimiento para el tratamiento de datos
            sea distinguible de la aceptación de los Términos y Condiciones contractuales. Dicho consentimiento se conserva en medios
            electrónicos conforme a la Ley 527 de 1999.
          </p>
        </section>

        {/* 7. Derechos de los Titulares (Habeas Data) */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            7. Derechos de los Titulares de la Información (Ley 1581 de 2012)
          </h2>
          <p>Como titular de datos personales, usted cuenta con los siguientes derechos legales:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li><strong>Conocer, actualizar y rectificar</strong> sus datos frente a información inexacta, incompleta o engañosa.</li>
            <li><strong>Solicitar prueba</strong> de la autorización otorgada a Go Driver para el tratamiento.</li>
            <li><strong>Ser informado</strong> respecto del uso y finalidades a las cuales han sido sometidos sus datos.</li>
            <li><strong>Presentar quejas</strong> ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.</li>
            <li><strong>Revocar la autorización o solicitar la supresión</strong> de datos cuando no medie un deber legal o contractual que impida su eliminación.</li>
            <li><strong>Acceder de forma gratuita</strong> a sus datos objeto de tratamiento.</li>
          </ul>
        </section>

        {/* 8. Procedimiento de Consultas y Reclamos */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            8. Procedimiento para el Ejercicio de Derechos (PQRS de Habeas Data)
          </h2>
          <p>
            El titular o sus causahabientes pueden remitir su solicitud indicando su nombre completo, número de documento,
            descripción clara del requerimiento y dirección de respuesta a:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
            <p><strong>Correo electrónico:</strong> miconductor2025@gmail.com</p>
            <p className="mt-1">
              <strong>Términos legales de respuesta (Ley 1581 de 2012):</strong>
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
              <li><strong>Consultas:</strong> Se resolverán en un término máximo de diez (10) días hábiles prorrogables por cinco (5) días hábiles más.</li>
              <li><strong>Reclamos (corrección, actualización o supresión):</strong> Se resolverán en un término máximo de quince (15) días hábiles prorrogables por ocho (8) días hábiles adicionales.</li>
            </ul>
          </div>
        </section>

        {/* 9. Seguridad y Medidas de Protección */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            9. Seguridad de la Información y Confidencialidad
          </h2>
          <p>
            Go Driver implementa medidas técnicas, humanas y administrativas de seguridad informática para evitar la adulteración,
            pérdida, consulta no autorizada o uso fraudulento de la información, aplicando cifrado en comunicaciones web, autenticación
            mediante tokens seguros (JWT) y segmentación estricta de accesos por roles (RBAC).
          </p>
        </section>

        {/* 10. Conservación, Transferencia y Encargados */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            10. Conservación y Transferencia de Datos
          </h2>
          <p>
            Los datos se conservarán durante el tiempo razonable y estrictamente necesario para cumplir las finalidades del servicio
            y atender obligaciones legales, tributarias o contractuales de archivo. Go Driver no vende ni comercializa bases de datos
            con terceros. Toda transmisión a encargados de infraestructura tecnológica se realiza bajo acuerdos que imponen deberes
            idénticos de protección de datos conforme a la legislación colombiana.
          </p>
        </section>

      </div>
    </LegalPageLayout>
  );
}
