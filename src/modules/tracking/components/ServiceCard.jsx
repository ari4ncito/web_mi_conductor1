import {
  FiArrowUpRight,
  FiUser,
} from "react-icons/fi";

const ServiceCard = ({
  id,
  status,
  statusColor,
  origin,
  destination,
  driver,
}) => {
  return (
    <div className="bg-white rounded-[18px] border border-[#ECECEC] p-[18px] transition-all duration-250 hover:-translate-y-[2px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]">

      <div className="flex justify-between items-center mb-[18px]">

        <span className="font-semibold text-[#46515C]">
          {id}
        </span>

        <span
          className={`py-1.5 px-3 rounded-[50px] text-[13px] font-semibold ${
            statusColor === "green"
              ? "bg-[#E2F8F2] text-[#11896A]"
              : "bg-[#FFE8E5] text-[#D44C42]"
          }`}
        >
          {status}
        </span>

      </div>

      <div className="flex gap-[18px] mb-5">

        <div className="flex flex-col items-center">

          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>

          <span className="w-[2px] h-[52px] bg-[#D6DCE3]"></span>

          <span className="w-2.5 h-2.5 rounded-full bg-[#0891B2]"></span>

        </div>

        <div className="flex flex-col justify-between">

          <div>

            <small className="text-[#9AA5B1] text-xs">Origen</small>

            <p className="mt-1 text-[15px] font-medium m-0">{origin}</p>

          </div>

          <div>

            <small className="text-[#9AA5B1] text-xs">Destino</small>

            <p className="mt-1 text-[15px] font-medium m-0">{destination}</p>

          </div>

        </div>

      </div>

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-2 text-[#46515C]">

          <FiUser />

          {driver}

        </div>

        <button className="w-9 h-9 rounded-[10px] bg-[#F3F6F9] flex items-center justify-center border-none cursor-pointer">

          <FiArrowUpRight />

        </button>

      </div>

    </div>
  );
};

export default ServiceCard;
