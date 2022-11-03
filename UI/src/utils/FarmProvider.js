import React, {useState, useEffect} from 'react'
import useLocalStorage from './useLocalStorage'
import FarmContext from './FarmContext';

function FarmProvider({children}) {
    const {setLocalStorage, getLocalStorage} = useLocalStorage()
    const [farm, setFarm] = useState(() => getLocalStorage("farm", ''));
    const valueFarm = { farm, setFarm };

    useEffect(() => {
        setLocalStorage("farm", farm);        
    }, [farm]);

    return (
        <FarmContext.Provider value={valueFarm}>
            {children}
        </FarmContext.Provider>
    )
}

export default FarmProvider