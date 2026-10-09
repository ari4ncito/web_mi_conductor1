import { useMemo, useState } from "react";

const colors = {
    surface: "#ffffff",
    text: "#1b1b1b",
    textMuted: "#667085",
    border: "rgba(17, 17, 17, 0.1)",
    accent: "#ff9a2f"
};

function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
                d="M6 6l12 12M18 6 6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
                d="m5 12 4.5 4.5L19 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function getDriverName(driver) {
    if (!driver) return "";

    if (driver.usuario) {
        return `${driver.usuario.nombre || ""} ${driver.usuario.apellido || ""}`.trim();
    }

    return driver.nombre || "";
}

function getDriverPhoto(driver) {
    return driver?.usuario?.foto || "";
}

export default function AssignDriverModal({
    onClose,
    onAssign,
    drivers = []
}) {
    const [selectedDriverId, setSelectedDriverId] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const availableDrivers = useMemo(
        () => drivers.filter(driver => driver.disponible === true),
        [drivers]
    );

    const handleConfirm = async () => {
        if (!selectedDriverId || submitting) return;

        const driver = availableDrivers.find(
            item => item._id === selectedDriverId
        );

        if (!driver) return;

        setSubmitting(true);

        try {
            await onAssign({
                driverId: driver._id,
                driverName: getDriverName(driver)
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mc-modal-overlay" style={{ zIndex: 1100 }}>
            <div
                className="mc-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="assign-driver-title"
                style={{
                    width: "min(900px, calc(100% - 32px))",
                    maxWidth: 900,
                    maxHeight: "90vh",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <div className="mc-modal-header">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 20
                        }}
                    >
                        <div>
                            <p className="mc-modal-subtitle">Asignación</p>
                            <h2 id="assign-driver-title" className="mc-modal-title">
                                Asignar conductor
                            </h2>
                            <p className="mc-modal-desc">
                                Selecciona un conductor disponible para esta solicitud.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar"
                            className="mc-modal-close"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div
                    className="mc-modal-body"
                    style={{ overflowY: "auto" }}
                >
                    {availableDrivers.length === 0 ? (
                        <div
                            style={{
                                padding: 32,
                                textAlign: "center",
                                color: colors.textMuted
                            }}
                        >
                            No hay conductores disponibles en este momento.
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                gap: 14
                            }}
                        >
                            {availableDrivers.map(driver => {
                                const selected = selectedDriverId === driver._id;
                                const name = getDriverName(driver);
                                const photo = getDriverPhoto(driver);

                                return (
                                    <button
                                        key={driver._id}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() => setSelectedDriverId(driver._id)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            width: "100%",
                                            minWidth: 0,
                                            minHeight: 100,
                                            padding: 14,
                                            borderRadius: 14,
                                            border: `1.5px solid ${
                                                selected ? colors.accent : colors.border
                                            }`,
                                            background: selected ? "#fff7ed" : colors.surface,
                                            boxShadow: selected
                                                ? "0 4px 14px rgba(255,154,47,0.12)"
                                                : "none",
                                            color: colors.text,
                                            cursor: "pointer",
                                            textAlign: "left",
                                            boxSizing: "border-box"
                                        }}
                                    >
                                        {photo ? (
                                            <img
                                                src={photo}
                                                alt=""
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    flexShrink: 0
                                                }}
                                            />
                                        ) : (
                                            <div
                                                aria-hidden="true"
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: "50%",
                                                    flexShrink: 0,
                                                    display: "grid",
                                                    placeItems: "center",
                                                    background: "#eaf1f7",
                                                    color: "#164e63",
                                                    fontSize: 18,
                                                    fontWeight: 700
                                                }}
                                            >
                                                {(name.charAt(0) || "C").toUpperCase()}
                                            </div>
                                        )}

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontWeight: 600,
                                                    overflowWrap: "anywhere"
                                                }}
                                            >
                                                {name || "Conductor sin nombre"}
                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    marginTop: 7,
                                                    color: "#15803d",
                                                    fontSize: 13
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: 7,
                                                        height: 7,
                                                        borderRadius: "50%",
                                                        background: "#16a34a",
                                                        flexShrink: 0
                                                    }}
                                                />
                                                Disponible
                                            </div>
                                        </div>

                                        {selected && (
                                            <span
                                                style={{
                                                    color: "#c66b00",
                                                    flexShrink: 0
                                                }}
                                            >
                                                <CheckIcon />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="mc-modal-footer">
                    <button
                        type="button"
                        onClick={onClose}
                        className="mc-btn-secondary"
                        disabled={submitting}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="mc-btn-primary"
                        disabled={!selectedDriverId || submitting}
                    >
                        {submitting ? "Asignando..." : "Asignar conductor"}
                    </button>
                </div>
            </div>
        </div>
    );
}