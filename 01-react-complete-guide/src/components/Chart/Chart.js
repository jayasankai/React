import ChartBar from "./ChartBar";
import "./Chart.css";

const Chart = (props) => {
  const dataPointValuesArr = props.dataPoints.map(
    (dataPoint) => dataPoint.value
  );
  const totalMaxValue = Math.max(...dataPointValuesArr);

  return (
    <div className="chart">
      {props.dataPoints.map((dataPoint) => (
        <ChartBar
          key={dataPoint.label}
          value={dataPoint.value}
          label={dataPoint.label}
          maxValue={totalMaxValue}
        />
      ))}
    </div>
  );
};

export default Chart;
