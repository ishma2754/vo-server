import {useState, useEffect } from "react";
import { useCookies } from "react-cookie";

import { UserCircleIcon } from "@heroicons/react/outline";

export default function Home() {
  const [cookies] = useCookies(null);
  const userEmail = cookies.Email;
  const authToken = cookies.AuthToken;
  const [formData, setFormData] = useState(null);

  const getFormData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/${userEmail}`
      );
      const json = await response.json();
      setFormData(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authToken) {
      getFormData();
    }
  }, []);

  const [data, setData] = useState({
    user_email: cookies.Email,
    name: "",
    age: "",
    emergencycontact: "",
    gender: "",
    medicalconditions: "",
    bloodgroup: "",
  });

  const postData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        getFormData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        getFormData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitHome = async (e) => {
    e.preventDefault();

    if (formData && formData.length > 0) {
      await updateData();
    } else {
      await postData();
    }
  };

  const handleChangeHome = (e) => {
    const { name, value } = e.target;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const sortedFormData = formData?.sort((a, b) => b.id - a.id);

  return (
    <div>
      <div className="flex justify-center mt-8 mb-8">
        <UserCircleIcon className="h-20 w-20 text-gray-600" />
      </div>

      <form className="max-w-md mx-8 lg:mx-auto" onSubmit={handleSubmitHome}>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleChangeHome}
              className="block py-2.5 px-0 w-full text-sm text-inputTextColor bg-transparent border-0 border-b-2 border-underlineHome appearance-none focus:outline-none focus:ring-0 focus:border-RussianViolet peer"
              placeholder=""
              required
            />
            <label
              htmlFor="name"
              className="peer-focus:font-medium absolute text-sm text-underlineHome duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-RussianViolet  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Name
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="number"
              name="age"
              id="age"
              value={data.age}
              onChange={handleChangeHome}
              className="block py-2.5 px-0 w-full text-sm text-inputTextColor bg-transparent border-0 border-b-2 border-underlineHome appearance-none focus:outline-none focus:ring-0 focus:border-RussianViolet peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="age"
             className="peer-focus:font-medium absolute text-sm text-underlineHome  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-RussianViolet  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Age
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="tel"
              pattern="[789][0-9]{9}"
              name="emergencycontact"
              id="emergencycontact"
              value={data.emergencycontact}
              onChange={handleChangeHome}
             className="block py-2.5 px-0 w-full text-sm text-inputTextColor bg-transparent border-0 border-b-2 border-underlineHome appearance-none focus:outline-none focus:ring-0 focus:border-RussianViolet peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="emergencycontact"
              className="peer-focus:font-medium absolute text-sm text-underlineHome duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-RussianViolet  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Emergency Contact
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <select
              name="gender"
              id="gender"
              value={data.gender}
              onChange={handleChangeHome}
              className="block py-2.5 px-0 w-full text-sm text-inputTextColor bg-transparent border-0 border-b-2 border-underlineHome appearance-none focus:outline-none focus:ring-0 focus:border-RussianViolet peer"
              required
            >
              <option  value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <label
              htmlFor="gender"
             className="peer-focus:font-medium absolute text-sm text-underlineHome duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-RussianViolet  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Gender
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <select
              name="bloodgroup"
              id="bloodgroup"
              value={data.bloodgroup}
              onChange={handleChangeHome}
              className="block py-2.5 px-0 w-full text-sm text-inputTextColor bg-transparent border-0 border-b-2 border-underlineHome appearance-none focus:outline-none focus:ring-0 focus:border-RussianViolet peer"
              required
            >
              <option value="" disabled>
                Select Blood Group
              </option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <label
              htmlFor="bloodgroup"
              className="peer-focus:font-medium absolute text-sm text-underlineHome  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-RussianViolet  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Blood Group
            </label>
          </div>
        </div>

        <label
          htmlFor="medicalconditions"
          className="block mb-2 text-sm font-medium text-underlineHome"
        >
          Medical Conditions And Presciptions
        </label>
        <textarea
          id="medicalconditions"
          value={data.medicalconditions}
          onChange={(e) =>
            setData((data) => ({
              ...data,
              medicalconditions: e.target.value,
            }))
          }
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-2 border-underlineHome focus:ring-blue-500 focus:border-RussianViolet mb-6"
          placeholder=""
        ></textarea>

        <button
          type="submit"
          className="text-white bg-buttonColor hover:bg-hoverButtonColor focus:ring-4 focus:outline-none focus:ring-RussianViolet font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          onSubmit={handleSubmitHome}
        >
          Submit
        </button>
      </form>

      <div className="max-w-md mx-4 lg:mx-auto border-4 border-RussianViolet rounded-lg p-4 mt-8">
        <h2 className="text-lg text-inputTextColor font-bold mb-4">USER DETAILS</h2>
        <div className="">
          {sortedFormData?.map((formDataItem) => (
            <div key={formDataItem.id} className="grid grid-cols-3 gap-4">
              <div>
                <div className="font-semibold text-underlineHome">Name</div>
                <div className="text-inputTextColor">{formDataItem.name}</div>
              </div>
              <div>
                <div className="font-semibold text-underlineHome">Age</div>
                <div className="text-inputTextColor">{formDataItem.age}</div>
              </div>
              <div>
                <div className="font-semibold text-underlineHome">Blood Group</div>
                <div className="text-inputTextColor">{formDataItem.bloodgroup}</div>
              </div>
              <div>
                <div className="font-semibold text-underlineHome">Emergency Contact</div>
                <div className="text-inputTextColor">{formDataItem.emergencycontact}</div>
              </div>
              <div>
                <div className="font-semibold text-underlineHome ">Gender</div>
                <div className="text-inputTextColor">{formDataItem.gender}</div>
              </div>
              <div className="col-span-3">
                <div className="font-semibold text-underlineHome">Medical Conditions And Prescriptions</div>
                <div className="text-inputTextColor" >{formDataItem.medicalconditions}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
