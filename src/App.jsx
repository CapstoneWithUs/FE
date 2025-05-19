import './App.css';
import FaceDetection from './FaceDetection';
import ApiTestPanel from './test/ApiTestPanel';

function App() {
  return (
    <div className="App">
      <FaceDetection></FaceDetection>
      <ApiTestPanel></ApiTestPanel>
    </div>
  );
}

export default App;
