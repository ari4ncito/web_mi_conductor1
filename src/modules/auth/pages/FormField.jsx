export default function FormField({ label, icon, error, action, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#FCEFEF]/60">
        {label}
      </span>
      <div
        className={`flex items-center gap-3 rounded-xl border bg-[#04141f] px-4 py-3 transition focus-within:ring-2 ${
          error
            ? 'border-rose-500/70 focus-within:ring-rose-500/30'
            : 'border-white/10 focus-within:border-[#1B768E] focus-within:ring-[#1B768E]/30'
        }`}
      >
        <span className="shrink-0 text-[#1B768E]">{icon}</span>
        <input
          className="w-full bg-transparent text-sm text-[#FCEFEF] outline-none placeholder:text-[#FCEFEF]/30"
          {...inputProps}
        />
        {action}
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </label>
  )
}
