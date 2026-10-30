export default function FormField({
  label,
  icon,
  error,
  isValid = false,
  isValidating = false,
  action,
  requiredMark = false,
  helperText,
  id,
  className = '',
  ...inputProps
}) {
  const borderAndRing = error
    ? 'border-rose-500/70 focus-within:border-rose-500 focus-within:ring-rose-500/30'
    : isValid
    ? 'border-emerald-500/60 focus-within:border-emerald-400 focus-within:ring-emerald-500/20'
    : 'border-white/10 focus-within:border-[#1B768E] focus-within:ring-[#1B768E]/30';

  return (
    <label htmlFor={id} className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#FCEFEF]/60">
          <span>
            {label}
            {requiredMark && <span className="ml-1 text-rose-400">*</span>}
          </span>
          {isValidating && (
            <span className="flex items-center gap-1 text-[11px] font-normal lowercase tracking-normal text-[#FB9833] animate-pulse">
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              comprobando...
            </span>
          )}
        </span>
      )}

      <div
        className={`flex items-center gap-3 rounded-xl border bg-[#04141f] px-4 py-3 transition focus-within:ring-2 ${borderAndRing}`}
      >
        {icon && (
          <span
            className={`shrink-0 transition-colors ${
              error
                ? 'text-rose-400'
                : isValid
                ? 'text-emerald-400'
                : 'text-[#1B768E]'
            }`}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          className="w-full bg-transparent text-sm text-[#FCEFEF] outline-none placeholder:text-[#FCEFEF]/30 disabled:opacity-50"
          {...inputProps}
        />

        {/* Indicador de campo válido si no hay acción o como complemento */}
        {isValid && !isValidating && !error && !action && (
          <span className="shrink-0 text-emerald-400" title="Campo válido" aria-label="Válido">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}

        {action}
      </div>

      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400" role="alert">
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-[#FCEFEF]/40">{helperText}</p>
      ) : null}
    </label>
  );
}
