import logo from './logo.svg';
import React, {useState} from 'react'
import './App.css';
// import Login from './pages/Login';
// import UserContext from './utils/UserContext'
import UserProvider from './utils/UserProvider';
import FarmProvider from './utils/FarmProvider';
import WorkflowProvider from './utils/WorkflowProvider';
import {BrowserRouter} from 'react-router-dom'
import Navigation from './routes/index'
import NodeContext from './utils/NodeContext';
import JsonFlowContext from './utils/JsonFlowContext';
import ExecutionProvider from './utils/ExecutionProvider';

function App() {

    const [node, setNode] = useState({});
    const valueNode = { node, setNode };

    const [jsonFlow, setJsonFlow] = useState({});
    const valueJson = { jsonFlow, setJsonFlow };

    

  return (
    <div className="App">
        <UserProvider>
            <FarmProvider>
                <WorkflowProvider>
                    <ExecutionProvider>
                        <JsonFlowContext.Provider value={valueJson}>
                            <NodeContext.Provider value={valueNode}>
                                <BrowserRouter>
                                    <Navigation/>
                                </BrowserRouter>
                            </NodeContext.Provider>
                        </JsonFlowContext.Provider>
                    </ExecutionProvider>
                </WorkflowProvider>
            </FarmProvider>
        </UserProvider>      
    </div>
  );
}

export default App;
