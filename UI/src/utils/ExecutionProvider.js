import React, {useState, useEffect} from 'react'
import useLocalStorage from './useLocalStorage'
import ExecutionContext from './ExecutionContext';

function ExecutionProvider({children}) {
    const {setLocalStorage, getLocalStorage} = useLocalStorage()
    const [execution, setExecution] = useState(() => getLocalStorage("execution", ''));
    const valueExecution = { execution, setExecution };

    useEffect(() => {
        setLocalStorage("execution", execution);        
    }, [execution]);

    return (
        <ExecutionContext.Provider value={valueExecution}>
            {children}
        </ExecutionContext.Provider>
    )
}

export default ExecutionProvider