import React, {useState, useEffect} from 'react'
import useLocalStorage from './useLocalStorage'
import WorkflowContext from './WorkflowContext';

function WorkflowProvider({children}) {

    const {setLocalStorage, getLocalStorage} = useLocalStorage()
    const [workflow, setWorkflow] = useState(() => getLocalStorage("workflow", ''));
    const valueWorkflow = { workflow, setWorkflow };

    useEffect(() => {
        setLocalStorage("workflow", workflow);        
    }, [workflow]);

    return (
        <WorkflowContext.Provider value={valueWorkflow}>
            {children}
        </WorkflowContext.Provider>
    )
}

export default WorkflowProvider