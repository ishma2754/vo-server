import { useContext, useEffect} from "react";
import Chart from "react-apexcharts";
import { GlobalContext } from "../../context/index";

export default function ChartPage() {
  const { inputValues, getInputData, deleteInputData} = useContext(GlobalContext);

  
  useEffect(() => {
    getInputData();
  }, []);

  const sortedInputValues = inputValues?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  function getColorForValue(x, y) {
    switch (x) {
      case "BP SYS":
        return y < 90 ? "#FF0000" : y <= 140 ? "#70e000" : "#FF0000";
      case "BP DIA":
        return y < 60 ? "#FF0000" : y <= 90 ? "#70e000" : "#FF0000";
      case "Pulse-Rate":
        return y < 60 ? "#FF0000" : y <= 100 ? "#70e000" : "#FF0000";
      case "Total Chol":
        return y <= 200 ? "#70e000" : "#FF0000";
      case "hdl Chol":
        return y <= 50 ? "#70e000" : "#FF0000";
      case "ldl Chol":
        return y <= 129 ? "#70e000" : "#FF0000";
      case "Blood Glucose Fasting":
        return y <= 100 ? "#70e000" : "#FF0000";
      case "Blood Glucose PP":
        return y <= 140 ? "#70e000" : "#FF0000";
      case "Creatinine":
        return y < 53 ? "#FF0000" : y <= 115 ? "#70e000" : "#FF0000";
      default:
        return "#70e000";
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-5 mt-5">
      {sortedInputValues?.map((inputValuesItem) => {
        const seriesData = [
          { x: "BP SYS", y: inputValuesItem.bpsys },
          { x: "BP DIA", y: inputValuesItem.bpdia },
          { x: "Pulse-Rate", y: inputValuesItem.pulserate },
          { x: "Total Chol", y: inputValuesItem.totalcholesterol },
          { x: "hdl Chol", y: inputValuesItem.hdlcholesterol },
          { x: "ldl Chol", y: inputValuesItem.ldlcholesterol },
          {
            x: "Blood Glucose Fasting",
            y: inputValuesItem.bloodglucosefasting,
          },
          { x: "Blood Glucose PP", y: inputValuesItem.bloodglucosepp },
          { x: "Creatinine", y: inputValuesItem.creatinine },
        ];

        const colors = seriesData.map((dataPoint) =>
          getColorForValue(dataPoint.x, dataPoint.y)
        );

        const chartOptions = {
          chart: {
            type: "bar",
            toolbar: {
              show: false,
            },
            animations: {
              enabled: true,
              easing: "easeinout",
              speed: 800,
            },
          },
          xaxis: {
            categories: seriesData.map((data) => data.x),
            labels: {
              style: {
                colors: "#32174D",
                fontSize: "10px",
                fontWeight: "bold",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: "#32174D",
                fontSize: "10px",
                fontWeight: "bold",
              },
            },
          },
          grid: {
            borderColor: "none",
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              borderRadius: 3,
              endingShape: "rounded",
            },
          },
          colors: colors,
          fill: {
            colors: colors,
          },
          dataLabels: {
            enabled: true,
            style: {
              colors: ["#000000"],
            },
            formatter: function (val) {
              return val;
            },
            tooltip: {
              theme: "light",
            },
          },
        };

        return (
          <div
            key={inputValuesItem.id}
            className="mb-4 border-4 rounded-lg border-underlineHome p-4"
          >
            <div className="text-center font-semibold mb-2">
              {inputValuesItem.date}
            </div>
            <Chart
              options={chartOptions}
              series={[
                {
                  name: "Values",
                  data: seriesData.map((dataPoint) => ({
                    x: dataPoint.x,
                    y: dataPoint.y,
                    fillColor: getColorForValue(dataPoint.x, dataPoint.y),
                  })),
                },
              ]}
              type="bar"
              height={350}
            />
             <div className="flex justify-center mt-2">
              <button
                 onClick={() => deleteInputData(inputValuesItem.id)}
                className="text-white bg-buttonColor hover:bg-hoverButtonColor focus:ring-4 focus:outline-none focus:ring-RussianViolet font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
