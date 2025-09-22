import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)
export default function GraphDirezione({ labels=[], s=[], s1=[] }){
  const data={ labels, datasets:[ {label:'S',data:s,borderWidth:2,tension:.3}, {label:'S-1',data:s1,borderWidth:2,tension:.3} ] }
  const options={ responsive:true, plugins:{ legend:{ position:'bottom' } } }
  return <Line data={data} options={options}/>
}
