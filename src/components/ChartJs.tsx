import React from "react"
import { useEffect, useRef } from "react"
import { Chart } from "chart.js"
import type { PropsWithChildren, ForwardedRef } from "react"
import type { ChartConfiguration, ChartData } from "chart.js"

export type PrepareChartDataFunc<TCanvasData> = (data: ChartData, canvasData: TCanvasData | undefined) => ChartData;

export type ChartJsProps<TCanvasData> = ChartConfiguration & {
  onInitCanvasData?: (ctx: CanvasRenderingContext2D) => TCanvasData,
  onPrepareChartData?: PrepareChartDataFunc<TCanvasData>,
  chartRef?: ForwardedRef<Chart>
}

export function ChartJs<TCanvasData = any>(
  {
    type,
    data,
    options,
    plugins,
    children,
    chartRef: ref,
    onInitCanvasData,
    onPrepareChartData,
  }: PropsWithChildren<ChartJsProps<TCanvasData>>
) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const canvasDataRef = useRef<TCanvasData>();

  useEffect(() => {

    if (canvasRef.current) {
      let ctx = canvasRef.current.getContext("2d");
      if (ctx) {

        if (!canvasDataRef.current && onInitCanvasData) {
          canvasDataRef.current = onInitCanvasData(ctx);
        }

        const getData = () => {
          return onPrepareChartData ?
            onPrepareChartData(data, canvasDataRef.current) : data;
        }

        if (chartRef.current) {
          if (chartRef.current.config.type === type) {
            chartRef.current.data = getData();
            chartRef.current.options = options ?? {};
            chartRef.current.update();
          }
          else {
            chartRef.current.destroy()
            chartRef.current = null;
          }
        }

        if (chartRef.current === null) {
          chartRef.current = new Chart(ctx, {
            type,
            data: getData(),
            options,
            plugins
          });
        }
      }
      else {
        console.warn('Failed to get canvas 2d context');
      }
    }

  }, [type, data, options, plugins, chartRef, onInitCanvasData, onPrepareChartData]);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    }
  }, [chartRef]);

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(chartRef.current);
      }
      else {
        ref.current = chartRef.current;
      }
    }
  });

  useEffect(() => {
    return () => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(null);
        }
        else {
          ref.current = null;
        }
      }
    }
  }, [ref]);

  return (
    <canvas ref={canvasRef}>{children}</canvas>
  )
}
