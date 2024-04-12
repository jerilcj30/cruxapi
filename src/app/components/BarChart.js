'use client'

import React, {useState, useEffect} from 'react'
import { Chart as ChartJS} from "chart.js/auto";
import {Bar} from "react-chartjs-2"

function BarChart() {
    const [histogramData, setHistogramData] = useState(null);
    const [type, setType] = useState('');
  const [url, setUrl] = useState('');


  useEffect(() => {
    const fetchData = async () => {
        if (!type || !url) {
            return; // Don't proceed if type or url is empty
        }
        
      try {
        const response = await fetch(`/api?type=${type}&url=${encodeURIComponent(url)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const metrics = data.record.metrics;
        // Extracting histogram data for each metric
        const metricHistogramData = Object.keys(metrics).reduce((acc, key) => {
          if (metrics[key].histogram) {
            acc[key] = metrics[key].histogram.map(({ start, end, density }) => ({
              range: `${start}-${end}`,
              density
            }));
          }
          return acc;
        }, {});
        setHistogramData(metricHistogramData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  },  [type, url]);

  return (
     <div className="">
         <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" />
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
    

      {histogramData && (
        <Bar
          data={{
            labels: Object.keys(histogramData),
            datasets: Object.entries(histogramData).map(([metric, values]) => ({
              label: metric,
              data: values.map(({ density }) => density),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            })),
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      )}
    </div>
  )
}

export default BarChart