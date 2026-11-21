import LegalPageLayout from '../components/LegalPageLayout';

export default function TerminosUsoPage() {
  return (
    <LegalPageLayout
      title="Términos y Condiciones de uso del sitio web"
      subtitle="Condiciones generales que regulan el acceso, navegación y utilización de la plataforma web Mi Conductor."
      lastUpdated="20 de noviembre de 2026"
    >
      <div className="space-y-10 text-sm sm:text-base leading-relaxed">
        
        {/* Aviso de Borrador */}
        <div className="bg-amber-50 border-l-4 border-accent p-4 rounded-r-xl text-amber-900 text-xs sm:text-sm">
          <strong>Aviso legal:</strong> El presente documento constituye un borrador formal elaborado de conformidad
          con la Ley 527 de 1999 y la Ley 1480 de 2011 (Estatuto del Consumidor de Colombia), sujeto a revisión y
          aprobación jurídica definitiva previo a su entrada en vigencia plena.
        </div>

        {/* 1. Identificación del Titular */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            1. Identificación del Titular de la Plataforma
          </h2>
          <p>
            En cumplimiento del deber de información establecido en el artículo 50 de la Ley 1480 de 2011, se hace
            constar la información general del titular y responsable de la plataforma tecnológica <strong>Mi Conductor</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li><strong>Nombre comercial:</strong> Go Driver</li>
            <li><strong>Razón social:</strong> [PENDIENTE DE DEFINICIÓN POR GO DRIVER]</li>
            <li><strong>NIT:</strong> [PENDIENTE DE DEFINICIÓN POR GO DRIVER]</li>
            <li><strong>Domicilio principal:</strong> Cartagena de Indias, Barrio Prado, Colombia</li>
            <li><strong>Dirección de notificación judicial:</strong> [PENDIENTE DE DEFINICIÓN POR GO DRIVER]</li>
            <li><strong>Teléfono de contacto:</strong> 314 543 9798</li>
            <li><strong>Correo electrónico de contacto y PQRS:</strong> juandavidriveracastillo@gmail.com</li>
          </ul>
        </section>

        {/* 2. Objeto y Alcance */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            2. Objeto y Alcance
          </h2>
          <p>
            Las presentes condiciones generales regulan el acceso, registro y uso de la plataforma web y móvil
            <strong> Mi Conductor</strong>. La plataforma es un entorno tecnológico diseñado y operado por Go Driver
            para gestionar, intermediar y coordinar servicios de conducción profesional privada, en los cuales un conductor
            capacitado traslada el vehículo particular (automóvil o motocicleta) de un cliente desde un punto de origen
            hasta el destino señalado.
          </p>
          <p>
            El uso de la plataforma atribuye la condición de Usuario (sea en calidad de Cliente, Conductor o Administrador)
            e implica la adhesión plena y sin reservas a todas y cada una de las disposiciones aquí establecidas.
          </p>
        </section>

        {/* 3. Descripción de la Plataforma y Funcionalidades */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            3. Descripción de la Plataforma y Módulos
          </h2>
          <p>
            Mi Conductor integra un ecosistema digital compuesto por una aplicación web administrativa y una aplicación móvil
            para usuarios operativos, estructuradas en los siguientes módulos y capacidades técnicas:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-primary-dark text-sm sm:text-base">Módulo Clientes</h3>
              <p className="text-xs text-slate-600">
                Registro de cuenta, administración de vehículos propios, solicitud de traslados, visualización de rutas,
                recepción de notificaciones y evaluación con calificación de 1 a 5 estrellas y comentarios.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-primary-dark text-sm sm:text-base">Módulo Conductores</h3>
              <p className="text-xs text-slate-600">
                Aceptación de asignaciones, registro fotográfico de verificación vehicular antes de iniciar el viaje,
                seguimiento del trayecto hacia el destino, reporte de novedades con evidencia fotográfica y entrega final.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-primary-dark text-sm sm:text-base">Módulo Administrador</h3>
              <p className="text-xs text-slate-600">
                Gestión de roles y permisos RBAC, asignación ágil de conductores a solicitudes, control documental de vigencias
                (licencias, SOAT, tecnomecánica), resolución de novedades y monitoreo operativo en dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Condiciones de Acceso, Registro y Responsabilidad de Cuentas */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            4. Condiciones de Acceso, Registro y Seguridad de Cuentas
          </h2>
          <p>
            Para acceder a las funcionalidades del sistema, el usuario debe completar el procedimiento de registro habilitado,
            suministrando información fidedigna, completa, exacta y actualizada (nombre, documento de identidad, teléfono y
            correo electrónico).
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <strong>Veracidad de la información:</strong> El usuario asume plena responsabilidad por la autenticidad de los
              datos suministrados. Go Driver se reserva el derecho de suspender o inhabilitar cuentas que contengan datos falsos o erróneos.
            </li>
            <li>
              <strong>Confidencialidad de credenciales:</strong> Las credenciales de acceso (usuario y contraseña) son de uso
              personal, intransferible y confidencial. Toda actividad realizada desde una cuenta autenticada se presumirá
              efectuada por su titular, salvo notificación previa de pérdida o vulneración de seguridad.
            </li>
            <li>
              <strong>Gestión de acceso:</strong> La plataforma provee mecanismos para inicio de sesión, recuperación de contraseñas
              mediante enlaces verificados y cierre voluntario de sesión.
            </li>
          </ul>
        </section>

        {/* 5. Roles y Permisos en la Plataforma */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            5. Sistema de Roles y Permisos (RBAC)
          </h2>
          <p>
            El acceso a las distintas funciones se encuentra jerarquizado bajo una arquitectura de Control de Acceso Basado en Roles (RBAC):
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <strong>Administrador:</strong> Cuenta con privilegios amplios para configurar roles, administrar cuentas, registrar
              o activar conductores y vehículos, asignar conductores a solicitudes, monitorear novedades y auditar el sistema.
            </li>
            <li>
              <strong>Conductor:</strong> Rol enfocado en la ejecución operativa del traslado vehicular, con permisos estrictos
              sobre sus solicitudes asignadas, inspección fotográfica, ruta y reporte de novedades.
            </li>
            <li>
              <strong>Cliente:</strong> Rol orientado a la gestión de sus vehículos, solicitudes de servicio, seguimiento del trayecto
              y evaluación del servicio.
            </li>
          </ul>
        </section>

        {/* 6. Uso Adecuado y Restricciones */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            6. Uso Adecuado de la Plataforma y Prohibiciones
          </h2>
          <p>Queda estrictamente prohibido a los usuarios:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li>Suplantar la identidad de cualquier persona natural o jurídica.</li>
            <li>Intentar eludir, desactivar o vulnerar los controles de autenticación, permisos o seguridad del sistema.</li>
            <li>Introducir software malicioso, virus, scripts automatizados o mecanismos no autorizados que alteren la plataforma.</li>
            <li>Utilizar la plataforma para fines ilícitos, fraudulentos o contrarios al ordenamiento jurídico colombiano.</li>
            <li>Registrar datos de vehículos respecto de los cuales no se tenga legítima tenencia o autorización.</li>
          </ul>
        </section>

        {/* 7. Disponibilidad del Servicio */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            7. Disponibilidad de la Plataforma y Mantenimiento
          </h2>
          <p>
            Go Driver procura la máxima disponibilidad y continuidad de la plataforma web; no obstante, el acceso puede suspenderse
            o limitarse temporalmente con ocasión de labores de mantenimiento programado, actualizaciones de software, fallas en
            redes de telecomunicaciones o eventos de fuerza mayor. Go Driver adoptará las medidas razonables para mitigar dichas
            interrupciones e informará oportunamente a los usuarios.
          </p>
        </section>

        {/* 8. Propiedad Intelectual */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            8. Propiedad Intelectual
          </h2>
          <p>
            Todos los derechos de propiedad intelectual sobre el software, código fuente, interfaces, marcas, lemas, logotipos,
            diseños gráficos, textos y contenidos de Mi Conductor son de propiedad exclusiva de Go Driver o cuentan con las debidas
            autorizaciones de sus titulares legítimos. Queda prohibida su reproducción, ingeniería inversa, distribución o transformación
            sin autorización previa y por escrito.
          </p>
        </section>

        {/* 9. Aceptación de los Términos */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            9. Aceptación Expresa de los Términos y Condiciones
          </h2>
          <p>
            Conforme a la Ley 527 de 1999 sobre mensajes de datos y comercio electrónico, la pulsación del botón de registro,
            inicio de sesión o confirmación de solicitud constituye manifestación inequívoca de consentimiento del usuario.
            La plataforma conservará constancia electrónica y trazable del momento de dicha aceptación.
          </p>
        </section>

        {/* 10. Modificaciones */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            10. Modificaciones a los Términos de Uso
          </h2>
          <p>
            Go Driver podrá actualizar los presentes términos para adecuarlos a mejoras tecnológicas o exigencias legales.
            Toda modificación sustancial será notificada a través de la plataforma o por correo electrónico registrado con antelación
            a su entrada en vigor.
          </p>
        </section>

        {/* 11. Atención al Usuario, PQRSF y Jurisdicción */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            11. Canales de Atención, PQRSF y Legislación Aplicable
          </h2>
          <p>
            Para consultas, quejas, reclamos o peticiones (PQRSF), los usuarios pueden dirigirse a:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li><strong>Correo electrónico:</strong> juandavidriveracastillo@gmail.com</li>
            <li><strong>Línea telefónica:</strong> 314 543 9798</li>
            <li><strong>Canal Ético y de Denuncias:</strong> Sección <a href="/linea-etica" className="text-primary font-medium hover:underline">Línea Ética</a> de la plataforma.</li>
          </ul>
          <p>
            Los presentes términos se rigen íntegramente por las leyes de la República de Colombia. Cualquier controversia será
            sometida a los mecanismos de solución directa previstos en la Ley 1480 de 2011 o a los jueces competentes de la jurisdicción ordinaria.
          </p>
        </section>

      </div>
    </LegalPageLayout>
  );
}
