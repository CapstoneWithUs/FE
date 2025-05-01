import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { GRAPH_INTERVAL } from './constants';

export default function TimeLineChart(props) {
  const now = performance.now();
  return (
    <LineChart width={300} height={150} data={props.data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis
        type="number"
        dataKey="time"
        domain={[now-GRAPH_INTERVAL, now]}
        tickFormatter={time => Math.floor((time-now)/1000)}
        tickCount={5}
      />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" dot={false} stroke="#82ca9d" isAnimationActive={false} />
    </LineChart>
  );
}
