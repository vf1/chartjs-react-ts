# chartjs-react-ts

A minimal React TypeScript wrapper for ChartJs provides access to the instance by ref.

## Installation

`npm i chartjs-react-ts`
OR
`yarn add chartjs-react-ts`

```
import { ChartJs } from 'chartjs-react-ts'
import { Chart, <REQUIRED FEATURES> } from 'chart.js'

Chart.register(<REQUIRED FEATURES>);

const App = () => {
  const chartRef = useRef<Chart | null>(null);

  return (
    <ChartJs type='line' data={data} options={options} chartRef={chartRef}>Not supported</ChartJs>
  )
}
```
