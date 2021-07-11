import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ChartJs } from '../dist'
import { useEffect, useRef, useState } from 'react'
import type { ChartData, ChartTypeRegistry } from 'chart.js'

import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js'

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);


function getLabels(start: number, numItems: number) {
  const labels: number[] = [];
  for (let i = 0; i < numItems; i++) {
    labels.push((start + i - 1) % 28 + 1);
  }
  return labels;
}

function getRandomData(numItems: number, maxValue: number) {
  let data: number[] = [];
  for (var i = 0; i < numItems; i++) {
    data.push(
      Math.round(maxValue * Math.random())
    );
  }
  return data;
}

const colors = ['red', 'blue', 'green']

function createDataset(index: number, title: string, numItems: number, maxValue: number) {
  return {
    label: title,
    data: getRandomData(numItems, maxValue),
    borderColor: colors[index],
    borderWidth: 6,
  }
}

const createData = (numItems: number, maxValues: number[]): ChartData => {
  return {
    labels: getLabels(5, numItems),
    datasets: [
      ...maxValues.map((maxValue, index) => createDataset(index, `Sample #${index}`, numItems, maxValue))
    ]
  }
}

const defaultData = createData(30, [10000000, 5000000, 3000000]);

const options = {
  responsive: true,
  maintainAspectRatio: false,
}

const btnStyle = {
  marginRight: '1ch',
};

const App = () => {
  const chartRef = useRef<Chart | null>(null);
  const [data1, setData1] = useState<ChartData>(defaultData);
  const [created, setCreated] = useState(true);
  const [chartjsId, setChartjsId] = useState<string | undefined>(undefined);
  const [rerender, setRerender] = useState(0);
  const [chartjsType, setChartjsType] = useState<keyof ChartTypeRegistry>('line');

  useEffect(() => {
    const timerId = setInterval(() => {
      if (chartRef.current?.id !== chartjsId) {
        setChartjsId(chartRef.current?.id);
      }
    }, 500);

    return () => {
      clearInterval(timerId);
    }
  }, [chartjsId]);

  return (
    <>
      <div style={{ border: 'solid 1px red', height: '200px', position: 'relative' }}>
        {
          created
            ? (<ChartJs type={chartjsType} data={data1} options={options} chartRef={chartRef}>Not supported</ChartJs>)
            : (null)
        }
      </div>
      <div style={{ paddingTop: '50px' }}>
        <button type="button" onClick={() => setData1(createData(30, [10000, 10000]))} style={btnStyle}>Update Data</button>
        <button type="button" onClick={() => setChartjsType('line')} style={btnStyle}>Line</button>
        <button type="button" onClick={() => setChartjsType('bar')} style={btnStyle}>Bar</button>
        <button type="button" onClick={() => setCreated(!created)} style={btnStyle}>{created ? 'Destory' : 'Create'}</button>
        <button type="button" onClick={() => console.log('Ref:', chartRef.current)} style={btnStyle}>Console Ref</button>
        <button type="button" onClick={() => setRerender(rerender + 1)} style={btnStyle}>Re-render {rerender}</button>
      </div>
      <div style={{ paddingTop: '50px' }}>
        ChartJS.id: {chartjsId ?? 'undefined'}
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
