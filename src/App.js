import { Container } from 'semantic-ui-react';

import Canvas from './components/Canvas';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {

  const data = {
    backgroundImage: `/assets/demo_bg.png`,
    dimension: {
      width: 6600,
      height: 4400
    },
    components: [
      {
        title: '平腕臂底座',
        boundingBox: {
          'xmin': 230/1200,
          'ymin': 365/800,
          'xmax': 280/1200,
          'ymax': 420/800
        },
        style: {
          color: 'yellow',
          lineWidth: '4'
        },
        details: [
          {
            title: '缺陷1.1',
            image: `/assets/demo_defect_1.png`,
            boundingBox: {
              'xmin': 230/1200,
              'ymin': 280/800,
              'xmax': 280/1200,
              'ymax': 330/800
            },
            style: {
              color: 'white',
              lineWidth: '4'
            }
          },
          {
            title: '缺陷1.2',
            image: `/assets/demo_defect_1.png`,
            boundingBox: {
              'xmin': 312/1200,
              'ymin': 368/800,
              'xmax': 362/1200,
              'ymax': 418/800
            },
            style: {
              color: 'yellow',
              lineWidth: '2'
            }
          },
        ]
      },
      {
        title: '套管单耳',
        boundingBox: {
          'xmin': 420/1200,
          'ymin': 335/800,
          'xmax': 449/1200,
          'ymax': 407/800
        },
        style: {
          color: 'magenta',
          lineWidth: '4'
        },
        details: [
          {
            title: '缺陷2.1',
            image: `/assets/demo_defect_2.png`,
            boundingBox: {
              'xmin': 475/1200,
              'ymin': 405/800,
              'xmax': 501/1200,
              'ymax': 477/800
            },
            style: {
              color: 'tan',
              lineWidth: '4'
            }
          },
          {
            title: '缺陷2.2',
            image: `/assets/demo_defect_2.png`,
            boundingBox: {
              'xmin': 503/1200,
              'ymin': 270/800,
              'xmax': 532/1200,
              'ymax': 342/800
            },
            style: {
              color: 'lightcyan',
              lineWidth: '4'
            }
          },
          {
            title: '缺陷2.3',
            image: `/assets/demo_defect_2.png`,
            boundingBox: {
              'xmin': 345/1200,
              'ymin': 330/800,
              'xmax': 374/1200,
              'ymax': 402/800
            },
            style: {
              color: 'lightgreen',
              lineWidth: '2'
            }
          },
        ]
      },
    ]
  }

  return (
    <Container fluid className="App">
      <Canvas data={data} />
    </Container>
  );
}

export default App;
