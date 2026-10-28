
import solicitudApi from "./solicitudApi.js";
import clienteApi from "./clienteApi.js";
import vehiculoApi from "./vehiculoApi.js";

const ESTADO_BACKEND_TO_FRONTEND = {
    PENDIENTE: "Pendiente",
    EN_PROCESO: "En Proceso",
    COMPLETADO: "Completado",
    CANCELADO: "Cancelado"
};

const PRIORIDAD_BACKEND_TO_FRONTEND = {
    BAJA: "Baja",
    MEDIA: "Media",
    ALTA: "Alta",
    URGENTE: "Urgente"
};

const PRIORIDAD_FRONTEND_TO_BACKEND = {
    Baja: "BAJA",
    Media: "MEDIA",
    Alta: "ALTA",
    Urgente: "URGENTE"
};

function obtenerDatosRespuesta(response) {
    return response?.data ?? response;
}

function obtenerListaRespuesta(response) {
    const data = obtenerDatosRespuesta(response);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.solicitudes)) return data.solicitudes;
    if (Array.isArray(data?.clientes)) return data.clientes;
    if (Array.isArray(data?.vehiculos)) return data.vehiculos;
    if (Array.isArray(data?.rows)) return data.rows;
    if (Array.isArray(data?.data?.rows)) return data.data.rows;

    return [];
}

function getClientName(cliente) {
    if (!cliente) return "";

    if (cliente.usuario) {
        return `${cliente.usuario.nombre || ""} ${cliente.usuario.apellido || ""}`.trim();
    }

    return cliente.nombre || "";
}

function getClientDocument(cliente) {
    if (!cliente) return "";
    return (
        cliente.documento ||
        cliente.usuario?.documento ||
        cliente.identificacion ||
        ""
    );
}

function getDriverName(conductor) {
    if (!conductor) return "";

    if (conductor.usuario) {
        return `${conductor.usuario.nombre || ""} ${conductor.usuario.apellido || ""}`.trim();
    }

    return conductor.nombre || "";
}

function getDriverDocument(conductor) {
    if (!conductor) return "";
    return (
        conductor.documento ||
        conductor.usuario?.documento ||
        conductor.identificacion ||
        ""
    );
}

export function formatearFechaHora(fechaValor, defaultHora = "—") {
    if (!fechaValor) {
        return {
            fecha: "—",
            hora: defaultHora,
            completo: defaultHora !== "—" ? defaultHora : ""
        };
    }

    if (typeof fechaValor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fechaValor.trim())) {
        const [anio, mes, dia] = fechaValor.trim().split("-");
        const fecha = `${dia}/${mes}/${anio}`;
        return {
            fecha,
            hora: defaultHora,
            completo: `${fecha} ${defaultHora}`.trim()
        };
    }

    const d = new Date(fechaValor);
    if (Number.isNaN(d.getTime())) {
        return {
            fecha: "—",
            hora: defaultHora,
            completo: String(fechaValor)
        };
    }

    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const anio = d.getFullYear();
    const fecha = `${dia}/${mes}/${anio}`;

    let horas = d.getHours();
    const minutos = String(d.getMinutes()).padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12;
    horas = horas ? horas : 12;
    const hora = `${String(horas).padStart(2, "0")}:${minutos} ${ampm}`;

    return {
        fecha,
        hora,
        completo: `${fecha} ${hora}`
    };
}

function getVehicleLabel(vehiculo) {
    if (!vehiculo) return "";

    return [
        vehiculo.placa,
        vehiculo.marca,
        vehiculo.modelo
    ].filter(Boolean).join(" ");
}

function extractObjectId(value) {
    if (!value) return undefined;
    if (typeof value === "object") {
        const id = value._id || value.id || "";
        const str = String(id).trim();
        return /^[0-9a-fA-F]{24}$/.test(str) ? str : undefined;
    }
    const str = String(value).trim();
    return /^[0-9a-fA-F]{24}$/.test(str) ? str : undefined;
}

function formatearDescripcionParaBackend(desc) {
    const trimmed = (desc || "").trim();
    if (!trimmed) {
        return "Sin descripción del servicio solicitado";
    }
    if (trimmed.length < 10) {
        return `${trimmed} - Sin descripción adicional`;
    }
    return trimmed.slice(0, 500);
}

export function mapSolicitudToFrontend(solicitud, shortCode) {
    if (!solicitud) return null;

    const rawCode = solicitud.codigo || "";
    const code = shortCode || rawCode;

    const fechaInicioRaw =
        solicitud.fechaInicio ||
        solicitud.fechaProgramada ||
        solicitud.createdAt;
    const fechaInicioFormatted = formatearFechaHora(fechaInicioRaw);

    let fechaFinFormatted;
    const fechaFinRaw =
        solicitud.fechaFin ||
        solicitud.fechaFinalizacion;

    const estadoNorm =
        ESTADO_BACKEND_TO_FRONTEND[solicitud.estado] ||
        solicitud.estado ||
        "Pendiente";

    if (fechaFinRaw) {
        fechaFinFormatted = formatearFechaHora(fechaFinRaw);
    } else if (estadoNorm === "Completado" || estadoNorm === "Cancelado") {
        if (solicitud.updatedAt) {
            fechaFinFormatted = formatearFechaHora(solicitud.updatedAt);
        } else if (solicitud.createdAt) {
            fechaFinFormatted = formatearFechaHora(solicitud.createdAt);
        } else {
            fechaFinFormatted = { fecha: "—", hora: "Finalizado", completo: "Finalizado" };
        }
    } else if (estadoNorm === "En Proceso") {
        fechaFinFormatted = { fecha: "—", hora: "En curso", completo: "En curso" };
    } else {
        fechaFinFormatted = { fecha: "—", hora: "Pendiente", completo: "Pendiente" };
    }

    return {
        id: solicitud._id,
        code,
        fullCode: rawCode,
        client: getClientName(solicitud.cliente),
        clientId: solicitud.cliente?._id || solicitud.cliente || "",
        clientEmail:
            solicitud.correoCliente ||
            solicitud.cliente?.usuario?.correo ||
            solicitud.cliente?.correo ||
            "",
        tipoDocumento:
            solicitud.cliente?.tipoDocumento ||
            solicitud.cliente?.usuario?.tipoDocumento ||
            "CC",
        documento: getClientDocument(solicitud.cliente),
        driver: getDriverName(solicitud.conductorAsignado),
        driverDocument: getDriverDocument(solicitud.conductorAsignado),
        driverId:
            solicitud.conductorAsignado?._id ||
            solicitud.conductorAsignado ||
            "",
        vehicle: getVehicleLabel(solicitud.vehiculo),
        vehicleId: solicitud.vehiculo?._id || solicitud.vehiculo || "",
        serviceType: solicitud.tipoServicio || "",
        description:
            solicitud.descripcion === "Sin descripción del servicio solicitado" ||
            solicitud.descripcion === "Solicitud de servicio de transporte"
                ? ""
                : (solicitud.descripcion || "").replace(/ - Sin descripción adicional$/, "").replace(/ - Solicitud de transporte$/, ""),
        origin: solicitud.origen || "",
        destination: solicitud.destino || "",
        scheduledDate: solicitud.fechaProgramada || "",
        fechaInicio: fechaInicioRaw || "",
        fechaInicioFormatted,
        fechaFin: fechaFinRaw || "",
        fechaFinFormatted,
        status: estadoNorm,
        priority:
            PRIORIDAD_BACKEND_TO_FRONTEND[solicitud.prioridad] ||
            solicitud.prioridad ||
            "Media",
        createdBy: "Admin",
        createdAt: solicitud.createdAt || "",
        updatedAt: solicitud.updatedAt || ""
    };
}

export function mapRequestToBackend(form) {
    const cleanClientId = extractObjectId(form.clientId);
    const cleanVehicleId = extractObjectId(form.vehicleId);
    const cleanDriverId = extractObjectId(form.driverId);

    const payload = {
        correoCliente: form.clientEmail?.trim().toLowerCase(),
        tipoServicio: form.serviceType?.trim() || "Transporte Ejecutivo",
        descripcion: formatearDescripcionParaBackend(form.description),
        origen: form.origin?.trim(),
        destino: form.destination?.trim(),
        prioridad:
            PRIORIDAD_FRONTEND_TO_BACKEND[form.priority] || "MEDIA"
    };

    if (cleanClientId) {
        payload.cliente = cleanClientId;
    }

    if (cleanDriverId) {
        payload.conductorAsignado = cleanDriverId;
    }

    if (cleanVehicleId) {
        payload.vehiculo = cleanVehicleId;
    }

    if (form.isGuest) {
        payload.esInvitado = true;
        payload.nombreCliente = form.clientName?.trim() || form.client?.trim();
        payload.telefonoCliente = form.clientPhone?.trim();
        payload.tipoDocumentoCliente = form.tipoDocumento?.trim();
        payload.documentoCliente = form.documento?.trim();
        if (form.vehiclePlaca || form.vehicleMarca) {
            payload.datosVehiculo = {
                marca: form.vehicleMarca?.trim(),
                modelo: form.vehicleModelo?.trim(),
                placa: form.vehiclePlaca?.trim().toUpperCase(),
                anio: form.vehicleAnio ? Number(form.vehicleAnio) : undefined,
                color: form.vehicleColor?.trim(),
                tipoVehiculo: form.vehicleTipoVehiculo?.trim()
            };
        }
    }

    // El backend genera el código y la fecha programada.
    // El estado también lo determina el backend.
    return payload;
}

export async function getServiceRequests() {
    const response = await solicitudApi.getAll();
    const solicitudes = obtenerListaRespuesta(response);

    // Ordenar cronológicamente ascendente (por createdAt o fecha) para numerar de forma estable:
    // La primera solicitud creada es SOL-001, la segunda SOL-002, etc.
    const sorted = [...solicitudes].sort((a, b) => {
        const timeA = new Date(a.createdAt || a.fechaProgramada || 0).getTime();
        const timeB = new Date(b.createdAt || b.fechaProgramada || 0).getTime();
        if (timeA !== timeB) return timeA - timeB;
        return String(a._id || "").localeCompare(String(b._id || ""));
    });

    const codeMap = new Map();
    sorted.forEach((sol, idx) => {
        const num = idx + 1;
        const shortCode = `SOL-${String(num).padStart(3, "0")}`;
        const key = sol._id || sol.id;
        if (key) {
            codeMap.set(String(key), shortCode);
        }
    });

    return solicitudes
        .map(s => {
            const shortCode = codeMap.get(String(s._id || s.id));
            return mapSolicitudToFrontend(s, shortCode);
        })
        .filter(Boolean);
}

export async function getServiceRequestById(id) {
    const [singleResp, allResp] = await Promise.allSettled([
        solicitudApi.getById(id),
        solicitudApi.getAll()
    ]);
    const solicitud = obtenerDatosRespuesta(
        singleResp.status === "fulfilled" ? singleResp.value : null
    );

    if (!solicitud) return null;

    let shortCode = "";
    if (allResp.status === "fulfilled") {
        const all = obtenerListaRespuesta(allResp.value);
        const sorted = [...all].sort((a, b) => {
            const timeA = new Date(a.createdAt || a.fechaProgramada || 0).getTime();
            const timeB = new Date(b.createdAt || b.fechaProgramada || 0).getTime();
            if (timeA !== timeB) return timeA - timeB;
            return String(a._id || "").localeCompare(String(b._id || ""));
        });
        const idx = sorted.findIndex(s => String(s._id || s.id) === String(id));
        if (idx !== -1) {
            shortCode = `SOL-${String(idx + 1).padStart(3, "0")}`;
        }
    }

    return mapSolicitudToFrontend(solicitud, shortCode);
}

export async function saveServiceRequest(form) {
    if (form.isGuest) {
        // 1. Resolver o registrar el Cliente en la base de datos (tabla usuario con rol cliente)
        let finalClientId = form.clientId;

        // Si no tenemos clientId directo, buscamos si ya existe por documento o correo para no duplicar
        if (!finalClientId) {
            try {
                const [listaResp, fullResp] = await Promise.allSettled([
                    clienteApi.getAll(),
                    clienteApi.getAllFull()
                ]);

                const candidatos = [
                    ...obtenerListaRespuesta(listaResp.status === "fulfilled" ? listaResp.value : []),
                    ...obtenerListaRespuesta(fullResp.status === "fulfilled" ? fullResp.value : [])
                ];

                const docBuscado = form.documento?.trim();
                const correoBuscado = form.clientEmail?.trim().toLowerCase();

                const clienteExistente = candidatos.find(c => {
                    const cDoc = c.documento || c.usuario?.documento;
                    const cEmail = (c.usuario?.correo || c.correo || "").toLowerCase();
                    return (
                        (docBuscado && String(cDoc) === String(docBuscado)) ||
                        (correoBuscado && cEmail === correoBuscado)
                    );
                });

                if (clienteExistente) {
                    const norm = s => (s || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const existName = norm(getClientName(clienteExistente));
                    const formName = norm(form.clientName || form.client);
                    const existEmail = (clienteExistente.usuario?.correo || clienteExistente.correo || "").toLowerCase().trim();
                    const existDoc = String(clienteExistente.documento || clienteExistente.usuario?.documento || "").trim();

                    if (docBuscado && existDoc && docBuscado.toLowerCase() === existDoc.toLowerCase()) {
                        if (formName && existName && formName !== existName) {
                            throw new Error(`Este documento ya pertenece a ${getClientName(clienteExistente)}. Los datos deben coincidir.`);
                        }
                        if (correoBuscado && existEmail && correoBuscado !== existEmail) {
                            throw new Error(`El correo no coincide con el registrado para este documento (${existEmail}).`);
                        }
                    } else if (correoBuscado && existEmail && correoBuscado === existEmail) {
                        if (docBuscado && existDoc && docBuscado.toLowerCase() !== existDoc.toLowerCase()) {
                            throw new Error(`Este correo ya está registrado con el documento ${existDoc}. Los datos deben coincidir.`);
                        }
                    }

                    finalClientId = clienteExistente._id || clienteExistente.id;
                }
            } catch (err) {
                console.warn("No se pudo verificar cliente existente:", err);
            }
        }

        // Si no existe en la base de datos, persistimos el nuevo cliente (usuario con rol cliente)
        if (!finalClientId) {
            let clienteRoleId = "";
            try {
                const rolesRes = await clienteApi.getRoles();
                const roles = obtenerListaRespuesta(rolesRes);
                const rolCliente = roles.find(r =>
                    r.nombre && r.nombre.toLowerCase().includes("cliente")
                );
                if (rolCliente) {
                    clienteRoleId = rolCliente._id || rolCliente.id;
                }
            } catch (err) {
                console.warn("No se pudo obtener el rol cliente:", err);
            }

            const fullName = (form.clientName || form.client || "").trim();
            const nameParts = fullName.split(" ");
            const nombre = nameParts[0] || "Cliente";
            const apellido = nameParts.slice(1).join(" ") || nombre;

            const clientPayload = {
                nombre,
                apellido,
                tipoDocumento: form.tipoDocumento || "CC",
                documento: form.documento?.trim(),
                correo: form.clientEmail?.trim().toLowerCase(),
                telefono: form.clientPhone?.trim() || "",
                password: `Cliente*${form.documento?.trim() || "12345"}`,
                rol: clienteRoleId,
                direccion: form.origin?.trim() || ""
            };

            const nuevoClienteRes = await clienteApi.create(clientPayload);
            const clientData =
                nuevoClienteRes?.data?.cliente ||
                nuevoClienteRes?.data?.data ||
                nuevoClienteRes?.data ||
                nuevoClienteRes?.cliente ||
                nuevoClienteRes;
            finalClientId = clientData?._id || clientData?.id;

            // Verificación de respaldo si el ID no vino directo en la respuesta
            if (!finalClientId) {
                const clientesActualizados = await clienteApi.getAll();
                const listaActualizada = obtenerListaRespuesta(clientesActualizados);
                const creado = listaActualizada.find(c => {
                    const cDoc = c.documento || c.usuario?.documento;
                    return String(cDoc) === String(form.documento?.trim());
                });
                if (creado) {
                    finalClientId = creado._id || creado.id;
                }
            }
        }

        // 2. Resolver o registrar el Vehículo en la base de datos (asociado al usuario/cliente)
        let finalVehicleId = form.vehicleId;

        // Comprobamos si la placa ya existe en la base de datos para no duplicar datos
        const placaBuscada = form.vehiclePlaca?.trim().toUpperCase();
        if (placaBuscada) {
            try {
                const vehiculosRes = await vehiculoApi.getAll();
                const listaVehiculos = obtenerListaRespuesta(vehiculosRes);
                const vehiculoExistente = listaVehiculos.find(v =>
                    v.placa && v.placa.trim().toUpperCase() === placaBuscada
                );

                if (vehiculoExistente) {
                    const ownerId = typeof vehiculoExistente.cliente === "object"
                        ? String(vehiculoExistente.cliente?._id || vehiculoExistente.cliente?.id || "")
                        : String(vehiculoExistente.cliente || "");

                    if (ownerId && finalClientId && ownerId !== String(finalClientId)) {
                        throw new Error(
                            `La placa ${placaBuscada} ya pertenece a otro cliente registrado y no puede ser utilizada por un cliente diferente.`
                        );
                    }

                    finalVehicleId = vehiculoExistente._id || vehiculoExistente.id;
                }
            } catch (err) {
                if (err.message && err.message.includes("La placa")) {
                    throw err;
                }
                console.warn("No se pudo consultar vehículos existentes:", err);
            }
        }

        // Si no existe en la base de datos, creamos el nuevo vehículo asociado al usuario/cliente
        if (!finalVehicleId && (placaBuscada || form.vehicleMarca)) {
            const vehiclePayload = {
                cliente: finalClientId,
                marca: form.vehicleMarca?.trim() || "Sin marca",
                modelo: form.vehicleModelo?.trim() || "Sin modelo",
                placa: placaBuscada,
                anio: form.vehicleAnio ? Number(form.vehicleAnio) : new Date().getFullYear(),
                color: form.vehicleColor?.trim() || "No especificado",
                tipoVehiculo: form.vehicleTipoVehiculo?.trim() || "Sedán",
                numeroPuertas: 4,
                numeroChasis: `VIN-${Date.now()}`,
                tipoCombustible: "Gasolina",
                estadoSeguro: "Activo",
                companiaAseguradora: "N/A",
                estado: true
            };

            const nuevoVehiculoRes = await vehiculoApi.create(vehiclePayload);
            const vehData =
                nuevoVehiculoRes?.data?.vehiculo ||
                nuevoVehiculoRes?.data?.data ||
                nuevoVehiculoRes?.data ||
                nuevoVehiculoRes?.vehiculo ||
                nuevoVehiculoRes;
            finalVehicleId = vehData?._id || vehData?.id;

            if (!finalVehicleId && placaBuscada) {
                const vehiculosActualizados = await vehiculoApi.getAll();
                const listaVehiculosActualizada = obtenerListaRespuesta(vehiculosActualizados);
                const encontrado = listaVehiculosActualizada.find(v =>
                    v.placa && v.placa.trim().toUpperCase() === placaBuscada
                );
                if (encontrado) {
                    finalVehicleId = encontrado._id || encontrado.id;
                }
            }
        }

        // 3. Los campos de la solicitud se guardan en la tabla solicitud como el otro formulario
        const cleanClientId = extractObjectId(finalClientId);
        const cleanVehicleId = extractObjectId(finalVehicleId);
        const cleanDriverId = extractObjectId(form.driverId);

        if (!cleanClientId) {
            throw new Error("No se pudo identificar o registrar el cliente para la solicitud. Verifica los datos del cliente.");
        }

        const solicitudPayload = {
            cliente: cleanClientId,
            origen: form.origin?.trim(),
            destino: form.destination?.trim(),
            tipoServicio: form.serviceType?.trim() || "Transporte Ejecutivo",
            prioridad: PRIORIDAD_FRONTEND_TO_BACKEND[form.priority] || "MEDIA",
            descripcion: formatearDescripcionParaBackend(form.description),
            correoCliente: form.clientEmail?.trim().toLowerCase()
        };

        if (cleanVehicleId) {
            solicitudPayload.vehiculo = cleanVehicleId;
        }

        if (cleanDriverId) {
            solicitudPayload.conductorAsignado = cleanDriverId;
        }

        if (form.id) {
            await solicitudApi.update(form.id, solicitudPayload);
        } else {
            await solicitudApi.create(solicitudPayload);
        }

        return getServiceRequests();
    }

    // Modo estándar
    const payload = mapRequestToBackend(form);

    if (form.id) {
        await solicitudApi.update(form.id, payload);
    } else {
        await solicitudApi.create(payload);
    }

    return getServiceRequests();
}

export async function deleteServiceRequest(id) {
    await solicitudApi.cancel(id);
    return getServiceRequests();
}

export async function assignDriver(solicitudId, driverId) {
    await solicitudApi.assignDriver(solicitudId, driverId);
    return getServiceRequests();
}

export async function cancelServiceRequest(id) {
    await solicitudApi.cancel(id);
    return getServiceRequests();
}

export async function completeServiceRequest(id) {
    await solicitudApi.complete(id);
    return getServiceRequests();
}

export function createEmptyServiceRequest() {
    return {
        id: "",
        code: "",
        fullCode: "",
        client: "",
        clientId: "",
        clientEmail: "",
        clientName: "",
        clientPhone: "",
        tipoDocumento: "",
        documento: "",
        driver: "",
        driverDocument: "",
        driverId: "",
        vehicle: "",
        vehicleId: "",
        vehicleMarca: "",
        vehicleModelo: "",
        vehiclePlaca: "",
        vehicleAnio: "",
        vehicleColor: "",
        vehicleTipoVehiculo: "",
        isGuest: false,
        serviceType: "Transporte Ejecutivo",
        description: "",
        origin: "",
        destination: "",
        scheduledDate: "",
        fechaInicio: "",
        fechaInicioFormatted: { fecha: "—", hora: "—", completo: "" },
        fechaFin: "",
        fechaFinFormatted: { fecha: "—", hora: "Pendiente", completo: "Pendiente" },
        status: "Pendiente",
        priority: "Media",
        createdBy: "Admin",
        createdAt: ""
    };
}
