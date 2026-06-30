// modules/roles/components/RoleStatusBadge.jsx

const STATUS_CONFIG = {
  active: {
    dot: 'bg-teal-500',
    text: 'text-teal-700',
    label: 'ACTIVE',
  },
  locked: {
    dot: 'bg-amber-800',
    text: 'text-amber-900',
    label: 'SYSTEM LOCKED',
  },
  inactive: {
    dot: 'bg-slate-400',
    text: 'text-slate-500',
    label: 'INACTIVE',
  },
};

/**
 * @param {{ status: 'active' | 'locked' | 'inactive' }} props
 */
export default function RoleStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
      <span className={`text-xs font-semibold tracking-wide leading-none ${cfg.text}`}>
        {cfg.label}
      </span>
    </span>
  );
}