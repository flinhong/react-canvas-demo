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
        title: '零件1',
        boundingBox: {
          'xmin': 0.1,
          'ymin': 0.2,
          'xmax': 0.3,
          'ymax': 0.4
        },
        defects: {
          
        }
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
