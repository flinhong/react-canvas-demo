import { Container } from 'semantic-ui-react';

import Canvas from './components/Canvas';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {

  const demo_defects = (num) => {
    const defects = [];
    for (let i = 0; i < num; i++) {
      const defect = {
        title: `defect_${i+1}`,
        width: 400,
        height: 400,
        image: '/assets/demo_defect.png'
      }
      defects.push(defect)
    }
    return defects;
  }

  const data = {
    background: {
      width: 6600,
      height: 4400,
      image: `/assets/demo_bg.png`
    },
    components: [
      {
        title: 'part1',
        boundingBox: [
          280, 350,
          600, 350
        ],
        defects: demo_defects(3)
      },
      {
        title: 'part2',
        boundingBox: [
          320, 650,
          400, 300
        ],
        defects: demo_defects(5)
      },
      {
        title: 'part3',
        boundingBox: [
          765, 280,
          300, 300
        ],
        defects: demo_defects(2)
      },
      {
        title: 'part4',
        boundingBox: [
          790, 530,
          300, 300
        ],
        defects: demo_defects(4)
      },
      {
        title: 'part5',
        boundingBox: [
          610, 600,
          1700, 270
        ],
        defects: demo_defects(3)
      }
    ]
  }

  return (
    <Container fluid className="App">
      <Canvas data={data} />
    </Container>
  );
}

export default App;
