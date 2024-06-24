import { useContext } from "react";
import { GlobalContext } from "../../context/index";

export default function Input() {
  const { dataInput, handleChange, handleSubmit } = useContext(GlobalContext);

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-6 mt-8">
        <div className="grid gap-6 mb-6 md:grid-cols-3 mt-6">
          <input
            type="date"
            name="date"
            id="date"
            value={dataInput.date}
            onChange={handleChange}
            className="bg-gray-50 border-2  border-underlineHome text-inputTextColor text-sm rounded-lg focus:ring-blue-500 focus:border-RussianViolet block w-full p-2.5"
            placeholder="Select a date"
            required
          />
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="bpsys"
              className="block mb-2 text-sm font-bold text-RussianViolet"
            >
              BP SYS / mmHg
            </label>
            <input
              type="number"
              name="bpsys"
              id="bpsys"
              value={dataInput.bpsys}
              onChange={handleChange}
              className="bg-gray-50 border-2  border-underlineHome text-inputTextColor text-sm rounded-lg focus:ring-blue-500 focus:border-RussianViolet block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label
              htmlFor="bpdia"
              className="block mb-2 text-sm font-bold text-RussianViolet"
            >
              BP DIA / mmHg
            </label>
            <input
              type="number"
              name="bpdia"
              id="bpdia"
              value={dataInput.bpdia}
              onChange={handleChange}
              className="bg-gray-50 border-2  border-underlineHome text-inputTextColor text-sm rounded-lg focus:ring-blue-500 focus:border-RussianViolet block w-full p-2.5"
              placeholder=""
              required
            />
          </div>
          <div>
            <label
              htmlFor="pulserate"
              className="block mb-2 text-sm font-bold text-RussianViolet"
            >
              Pulse Rate beats/min
            </label>
            <input
              type="number"
              name="pulserate"
              id="pulserate"
              value={dataInput.pulserate}
              onChange={handleChange}
              className="bg-gray-50 border-2  border-underlineHome text-inputTextColor text-sm rounded-lg focus:ring-blue-500 focus:border-RussianViolet block w-full p-2.5"
              placeholder=""
              required
            />
          </div>
          <div>
            <label
              htmlFor="totalcholesterol"
              className="block mb-2 text-sm font-bold text-RussianViolet"
            >
              Total Cholesterol mg/dL
            </label>
            <input
              type="number"
              name="totalcholesterol"
              id="totalcholesterol"
              value={dataInput.totalcholesterol}
              onChange={handleChange}
              className="bg-gray-50 border-2  border-underlineHome text-inputTextColor text-sm rounded-lg focus:ring-blue-500 focus:border-RussianViolet block w-full p-2.5"
              placeholder=""
              required
            />
          </div>
          <div>
            <label
              htmlFor="hdlcholesterol"
              className="block mb-2 text-sm font-bold text-RussianViolet"
            >
              HDL Cholesterol mg/dL
            </label>
            <input
              type="number"
              name="hdlcholesterol"
              id="hdlcholesterol"
              value={dataInput.hdlcholesterol}
              onChange={handleChange}
              className="bg-gray-50 border-2  border-underlineHome text-inputTextColor text-sm rounded-lg focus:ring-blue-500 focus:border-RussianViolet block w-full p-2.5"
              placeholder=""
              required
            />
          </div>
          <div>
            <label
              htmlFor="ldlcholesterol"
              className="block mb-2 text-sm font-bold text-RussianViolet"
            >
              LDL Cholesterol mg/dL
            </label>
            <input
              type="number"
              name="ldlcholesterol"
              id="ldlcholesterol"
              value={dataInput.ldlcholesterol}
              onChange={handleChange}
              className="bg-gray-50 border-2  border-underlineHome text-inputTextColor text-sm rounded-lg focus:ring-blue-500 focus:border-RussianViolet block w-full p-2.5"
              placeholder=""
              required
            />
          </div>
          <div>
            <label
              htmlFor="bloodglucosefasting"
              className="block mb-2 text-sm font-bold text-RussianViolet"
            >
              Blood Glucose(Fasting) mg/dL
            </label>
            <input
              type="number"
              name="bloodglucosefasting"
              id="bloodglucosefasting"
              value={dataInput.bloodglucosefasting}
              onChange={handleChange}
              className="bg-gray-50 border-2  border-underlineHome text-inputTextColor text-sm rounded-lg focus:ring-blue-500 focus:border-RussianViolet block w-full p-2.5"
              placeholder=""
              required
            />
          </div>
          <div>
            <label
              htmlFor="bloodglucosepp"
              className="block mb-2 text-sm font-bold text-RussianViolet"
            >
              Blood Glucose(PP) mg/dL
            </label>
            <input
              type="number"
              name="bloodglucosepp"
              id="bloodglucosepp"
              value={dataInput.bloodglucosepp}
              onChange={handleChange}
              className="bg-gray-50 border-2  border-underlineHome text-inputTextColor text-sm rounded-lg focus:ring-blue-500 focus:border-RussianViolet block w-full p-2.5"
              placeholder=""
              required
            />
          </div>
          <div>
            <label
              htmlFor="creatinine"
              className="block mb-2 text-sm font-bold text-RussianViolet"
            >
              Creatinine µmol/l
            </label>
            <input
              type="number"
              name="creatinine"
              id="creatinine"
              value={dataInput.creatinine}
              onChange={handleChange}
              className="bg-gray-50 border-2  border-underlineHome text-inputTextColor text-sm rounded-lg focus:ring-blue-500 focus:border-RussianViolet block w-full p-2.5"
              placeholder=""
              required
            />
          </div>
        </div>

        <button
          type="submit"
          onSubmit={handleSubmit}
          className="text-white bg-buttonColor hover:bg-hoverButtonColor focus:ring-4 focus:outline-none focus:ring-RussianViolet font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mb-8"
        >
          Submit
        </button>
      </form>
    </>
  );
}
