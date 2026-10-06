import { history } from "../data/trackingData";

const HistoryPanel = () => {
  return (
    <section className="bg-white rounded-3xl p-5">

      <h3 className="text-lg text-[#555] mb-5 tracking-[0.04em]">HISTORIAL DE MOVIMIENTOS</h3>

      <div className="flex flex-col gap-[22px]">

        {history.map((item, index) => (

          <div key={index} className="flex gap-[15px]">

            <span className={`w-1 rounded-sm ${item.color === 'blue' ? 'bg-[#66D4FF]' : 'bg-[#F4A340]'}`}></span>

            <div>
              <p className="m-0 font-semibold">{item.title}</p>
              <small className="text-[#7E8A96]">{item.time}</small>
            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default HistoryPanel;
