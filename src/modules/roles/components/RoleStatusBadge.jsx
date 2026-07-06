// modules/roles/components/RoleStatusBadge.jsx

const STATUS_CONFIG = {
  active: { dot: '#14b8a6', text: '#0f766e', label: 'ACTIVO' },
  locked: { dot: '#92400e', text: '#78350f', label: 'BLOQUEADO' },
  inactive: { dot: '#94a3b8', text: '#64748b', label: 'INACTIVO' },
};

/**
 * @param {{ status: 'active' | 'locked' | 'inactive' }} props
 */
export default function RoleStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0, display: 'inline-block' }} />
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.02em', lineHeight: 1, color: cfg.text }}>
        {cfg.label}
      </span>
    </span>
  );
}