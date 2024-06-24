import { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import PropTypes from "prop-types";
import { format, parseISO } from "date-fns";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;

  const [inputValues, setInputValues] = useState(null);

  const getInputData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/Input/${userEmail}`
      );
      const json = await response.json();
      const adjustedDates = json.map((data) => ({
        ...data,
        date: format(parseISO(data.date), "yyyy-MM-dd"),
      }));
      setInputValues(adjustedDates);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteInputData = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/Input/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        getInputData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authToken) {
      getInputData();
    }
  }, []);

  const [dataInput, setDataInput] = useState({
    user_email: cookies.Email,
    bloodglucosefasting: "",
    bloodglucosepp: "",
    bpdia: "",
    bpsys: "",
    creatinine: "",
    hdlcholesterol: "",
    ldlcholesterol: "",
    pulserate: "",
    totalcholesterol: "",
    date: "",
  });

  const postInputData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/Input/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataInput),
        }
      );
      if (response.status === 200) {
        getInputData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDataInput((dataInput) => ({
      ...dataInput,
      [name]: name === "date" ? format(new Date(value), "yyyy-MM-dd") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await postInputData();
  };

  return (
    <GlobalContext.Provider
      value={{
        authToken,
        dataInput,
        setDataInput,
        inputValues,
        setInputValues,
        getInputData,
        deleteInputData,
        postInputData,
        handleChange,
        handleSubmit,
        userEmail,
        cookies,
        setCookie,
        removeCookie,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

GlobalState.propTypes = {
  children: PropTypes.node.isRequired,
};
