import { Container } from 'semantic-ui-react';

import Canvas from './components/Canvas';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {

  const data = {
    background: {
      width: 1200,
      height: 800,
      image: `https://source.unsplash.com/random/1200x800`
    },
    components: [
      {
        title: 'part 1',
        boundingBox: [
          100, 50,
          350, 250
        ],
        image: `https://source.unsplash.com/random/350x250`
      },
      {
        title: 'part 2',
        boundingBox: [
          500, 500,
          400, 250
        ],
        image: `https://source.unsplash.com/random/400x300`
      },
      {
        title: 'part 3',
        boundingBox: [
          700, 250,
          300, 300
        ],
        image: `https://source.unsplash.com/random/400x300`
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
