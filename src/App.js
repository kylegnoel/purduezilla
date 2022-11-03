import './App.css';
import Routing from "./routes/index";
import apiFunctions from './firebase/api';

function App() {
  return (
    //add in routing in here instead
    <apiFunctions.FirebaseAuthProvider>
      <div className="App">
        <Routing />
      </div>
    </apiFunctions.FirebaseAuthProvider>
  );
}

export default App;