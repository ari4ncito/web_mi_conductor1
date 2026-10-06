const LiveExecution = () => {
  return (
    <section className="bg-white rounded-3xl p-[22px]">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-bold text-[#122231]">Ejecución en Vivo</h2>

          <p className="mt-1.5 text-[#73808C] text-[15px]">12 Servicios Activos • 4 Alertas</p>

        </div>

        <div className="flex items-center gap-2 text-[#E53935] font-bold tracking-[0.08em] text-[13px]">

          <span className="w-[9px] h-[9px] bg-[#E53935] rounded-full animate-pulse"></span>

          EN VIVO

        </div>

      </div>

      <div className="flex gap-3.5 mt-7">

        <div className="flex-1 flex items-center justify-center gap-2.5 p-3.5 rounded-2xl font-semibold text-[15px] bg-[#DDF8F3] text-[#0A7A69]">

          <span className="w-2.5 h-2.5 rounded-full bg-current"></span>

          8 Operativos

        </div>

        <div className="flex-1 flex items-center justify-center gap-2.5 p-3.5 rounded-2xl font-semibold text-[15px] bg-[#FFE8E6] text-[#D14343]">

          <span className="w-2.5 h-2.5 rounded-full bg-current"></span>

          2 Demorados

        </div>

      </div>

    </section>
  );
};

export default LiveExecution;
