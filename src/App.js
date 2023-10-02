import { Route, Routes } from 'react-router-dom';
import './App.css';
import PopUp from './components/PopUp';
import RecordedVideo from './components/RecordedVideo';

function App() {
  return (
    <div className="">
      <PopUp />
      <Routes>
        <Route path='recorded-video' element={<RecordedVideo />} />
      </Routes>
    </div>
  );
}

export default App;