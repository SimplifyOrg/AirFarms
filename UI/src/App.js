import logo from './logo.svg';
import React, {useState} from 'react'
import './App.css';
// import Login from './pages/Login';
import UserContext from './utils/UserContext'
import FarmContext from './utils/FarmContext';
import WorkflowContext from './utils/WorkflowContext';
import {BrowserRouter} from 'react-router-dom'
import Navigation from './routes/index'
import NodeContext from './utils/NodeContext';
import JsonFlowContext from './utils/JsonFlowContext';

function App() {
    const [user, setUser] = useState({});
    const valueUser = { user, setUser };

    const [farm, setFarm] = useState({});
    const valueFarm = { farm, setFarm };

    const [workflow, setWorkflow] = useState({});
    const valueWorkflow = { workflow, setWorkflow };

    const [node, setNode] = useState({});
    const valueNode = { node, setNode };

    const [jsonFlow, setJsonFlow] = useState({});
    const valueJson = { jsonFlow, setJsonFlow };
  return (
    <div className="App">
        <UserContext.Provider value={valueUser}>
            <FarmContext.Provider value={valueFarm}>
                <WorkflowContext.Provider value={valueWorkflow}>
                    <JsonFlowContext.Provider value={valueJson}>
                        <NodeContext.Provider value={valueNode}>
                            <BrowserRouter>
                                <Navigation/>
                            </BrowserRouter>
                        </NodeContext.Provider>
                    </JsonFlowContext.Provider>
                </WorkflowContext.Provider>
            </FarmContext.Provider>
        </UserContext.Provider>      
    </div>
  );
}

export default App;
