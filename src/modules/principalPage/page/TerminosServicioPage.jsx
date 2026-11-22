import LegalPageLayout from '../components/LegalPageLayout';

export default function TerminosServicioPage() {
  return (
    <LegalPageLayout
      title="Términos y Condiciones del servicio"
      subtitle="Condiciones particulares bajo las cuales Go Driver gestiona y presta los servicios de conducción profesional mediante Mi Conductor."
      lastUpdated="20 de noviembre de 2026"
    >
      <div className="space-y-10 text-sm sm:text-base leading-relaxed">

        {/* Aviso de Borrador */}
        <div className="bg-amber-50 border-l-4 border-accent p-4 rounded-r-xl text-amber-900 text-xs sm:text-sm">
          <strong>Aviso legal:</strong> Este documento rige la relación de prestación de servicios entre el usuario y Go Driver,
          estructurado conforme a la Ley 1480 de 2011 (Estatuto del Consumidor), Ley 527 de 1999 y la Ley 769 de 2002
          (Código Nacional de Tránsito Terrestre y normas concordantes de Colombia). Sujeto a revisión jurídica previa.
        </div>

        {/* 1. Descripción del Servicio */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            1. Descripción y Alcance del Servicio
          </h2>
          <p>
            Go Driver presta, a través de la plataforma <strong>Mi Conductor</strong>, un servicio de conducción y traslado
            profesional seguro de vehículos particulares (automóviles o motocicletas) desde un punto de origen acordado hasta
            el destino final indicado por el cliente.
          </p>
          <p>
            Este servicio está enfocado primordialmente a personas que, por consumo de alcohol, cansancio físico, tratamientos
            médicos, estrés o indisposición transitoria, requieren que un conductor debidamente calificado y verificado traslade
            su vehículo en condiciones óptimas de seguridad.
          </p>
        </section>

        {/* 2. Solicitud y Asignación */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            2. Solicitud del Servicio y Asignación de Conductores
          </h2>
          <p>
            El cliente solicita el servicio a través de la aplicación móvil, especificando con exactitud la dirección de origen,
            destino final, fecha y hora programada o requerida, así como la identificación del vehículo registrado a trasladar.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <strong>Rol del Administrador:</strong> El Administrador de la plataforma posee los privilegios exclusivos para
              revisar solicitudes entrantes y asignar formalmente a un conductor que se encuentre en estado disponible y con
              documentación al día.
            </li>
            <li>
              <strong>Criterios de asignación:</strong> Se verifica que el conductor posea licencia de conducción vigente y en
              la categoría idónea correspondiente al tipo de vehículo solicitado.
            </li>
            <li>
              <strong>Notificación de asignación:</strong> Al confirmarse la asignación, el sistema notifica tanto al conductor
              (con los detalles del viaje) como al cliente (con los datos del conductor asignado).
            </li>
          </ul>
        </section>

        {/* 3. Requisitos Obligatorios del Conductor y del Vehículo */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            3. Requisitos del Conductor y Documentación Vehicular (Ley 769 de 2002)
          </h2>
          <p>
            En estricto cumplimiento del Código Nacional de Tránsito Terrestre de Colombia, para la ejecución válida del servicio:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-primary-dark text-sm sm:text-base">Requisitos del Conductor</h3>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                <li>Licencia de conducción vigente y sin suspensiones judiciales o administrativas.</li>
                <li>Categoría legal correspondiente al vehículo a operar (ej. B1/C1 para automóviles, A2 para motocicletas).</li>
                <li>Cumplimiento de las normas de tránsito y estado de sobriedad absoluta en todo momento.</li>
              </ul>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-primary-dark text-sm sm:text-base">Requisitos del Vehículo</h3>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                <li>Seguro Obligatorio de Accidentes de Tránsito (SOAT) debidamente vigente.</li>
                <li>Certificado de Revisión Técnico-Mecánica y de Emisiones Contaminantes vigente cuando sea legalmente exigible.</li>
                <li>Condiciones mínimas de funcionamiento mecánico y seguridad física que permitan su desplazamiento legal.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Obligaciones y Responsabilidades del Cliente */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            4. Responsabilidades del Cliente
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Suministrar datos verídicos y exactos sobre el origen, destino y condiciones del vehículo.</li>
            <li>Registrar oportunamente el vehículo con marca, modelo, placa, color y número de chasis.</li>
            <li>Aportar copia legible o verificación de los documentos del automotor (SOAT y tecnomecánica vigentes).</li>
            <li>Entregar el vehículo con combustible suficiente para cumplir el trayecto convenido.</li>
            <li>Retirar del vehículo objetos de valor, dinero o pertenencias no declaradas expresamente.</li>
            <li>Recibir el vehículo en el destino fijado y confirmar la finalización del servicio en la aplicación móvil.</li>
          </ul>
        </section>

        {/* 5. Obligaciones y Procedimiento del Conductor */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            5. Responsabilidades y Protocolo del Conductor
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Presentarse puntualmente en el punto de encuentro convenido.</li>
            <li>
              <strong>Registro fotográfico de verificación obligatorio:</strong> Antes de encender el automotor o iniciar la
              marcha, el conductor tomará fotografías de inspección inicial para registrar el estado de la carrocería, espejos,
              llantas y medidor de combustible.
            </li>
            <li>Iniciar formalmente el servicio desde la aplicación móvil.</li>
            <li>Conducir con apego estricto a las normas de seguridad vial y respetando la ruta trazada hacia el destino.</li>
            <li>Reportar cualquier novedad en ruta adjuntando fotos de respaldo.</li>
            <li>Entregar el vehículo de forma segura en el destino final y registrar la entrega en la plataforma.</li>
          </ul>
        </section>

        {/* 6. Seguimiento del Servicio y Visualización de Ruta */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            6. Visualización de Ruta y Seguimiento
          </h2>
          <p>
            El aplicativo provee herramientas para la visualización del recorrido entre el punto de origen y el destino.
            Esta funcionalidad permite a los perfiles autorizados (Cliente, Conductor y Administrador) consultar el trazado,
            verificar el progreso del servicio y optimizar la coordinación de la entrega. El acceso a estos datos está restringido
            estrictamente al tiempo de ejecución del servicio en curso.
          </p>
        </section>

        {/* 7. Reporte de Novedades e Incidencias en Ruta */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            7. Protocolo para Reporte de Novedades e Incidentes
          </h2>
          <p>
            Durante el recorrido pueden sobrevenir circunstancias no imputables a las partes, tales como congestión vial severa,
            accidentes de tránsito ajenos, fallas mecánicas preexistentes del vehículo o cierres viales.
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>El conductor reportará la novedad de inmediato desde su aplicación móvil tipificando el evento y adjuntando fotos testimoniales.</li>
            <li>El Administrador recibirá notificación prioritaria en tiempo real para evaluar el evento y registrar la solución recomendada.</li>
            <li>El Cliente será informado de manera transparente sobre la situación ocurrida y el tiempo estimado de solución.</li>
          </ul>
        </section>

        {/* 8. Sistema de Notificaciones */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            8. Notificaciones de la Plataforma
          </h2>
          <p>El sistema emite notificaciones operativas automáticas para mantener informadas a las partes:</p>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li><strong>Al Administrador:</strong> Notificación de nueva solicitud creada y alertas de novedades en ruta.</li>
            <li><strong>Al Cliente:</strong> Asignación de conductor, novedades en el traslado y confirmación de llegada.</li>
            <li><strong>Al Conductor:</strong> Nueva solicitud asignada y notificaciones de cancelación cuando aplique.</li>
          </ul>
        </section>

        {/* 9. Calificación del Servicio */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            9. Calificación y Retroalimentación
          </h2>
          <p>
            Al confirmarse la entrega del automotor, el cliente tiene la facultad de evaluar al conductor mediante una escala
            de 1 a 5 estrellas y formular comentarios sobre la calidad del servicio. Dicha retroalimentación alimenta las métricas
            de desempeño del dashboard administrativo para velar por los más altos estándares de servicio.
          </p>
        </section>

        {/* 10. Tarifas y Condiciones Económicas */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            10. Tarifas, Costos y Condiciones de Pago
          </h2>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-slate-700">
            <p>
              <strong>Estructura tarifaria:</strong> [PENDIENTE DE DEFINICIÓN POR GO DRIVER]
            </p>
            <p className="text-xs text-slate-500">
              Las tarifas, costos de servicios especiales, recargos nocturnos, penalidades de cancelación y métodos de pago
              serán informados de manera clara, previa y detallada antes de la aceptación definitiva de cada solicitud, de conformidad
              con los artículos 23 y siguientes de la Ley 1480 de 2011. Go Driver no aplicará cobros no informados previamente.
            </p>
          </div>
        </section>

        {/* 11. Cancelaciones, Responsabilidades y Reclamaciones */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            11. Cancelaciones, Responsabilidades y Derechos del Consumidor
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <strong>Cancelación de solicitudes:</strong> [POLÍTICA DE CANCELACIÓN Y TIEMPOS LÍMITE: PENDIENTE DE DEFINICIÓN POR GO DRIVER].
            </li>
            <li>
              <strong>Garantía y derechos del consumidor:</strong> De acuerdo con la Ley 1480 de 2011, los usuarios tienen derecho
              a recibir un servicio idóneo, seguro y de calidad. Go Driver no incorpora cláusulas que excluyan derechos irrenunciables
              ni exoneraciones generales de responsabilidad por hechos imputables a dolo o culpa comprobada.
            </li>
            <li>
              <strong>Reclamaciones por daños o incumplimiento:</strong> Cualquier inconformidad podrá ser canalizada formalmente
              a través de <code>miconductor2025@gmail.com</code>,
              acompañando el registro fotográfico de inspección previa y las evidencias recaudadas para su trámite según los términos legales.
            </li>
          </ul>
        </section>

      </div>
    </LegalPageLayout>
  );
}
