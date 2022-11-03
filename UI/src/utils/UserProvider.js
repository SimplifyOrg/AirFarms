import React, {useState, useEffect} from 'react'
import useLocalStorage from './useLocalStorage'
import UserContext from './UserContext';


function UserProvider({children}) {

    const {setLocalStorage, getLocalStorage} = useLocalStorage()
    const [user, setUser] = useState(() => getLocalStorage("user", ''));
    const valueUser = { user, setUser };

    // window.addEventListener("load", (event) => {
    //     const savedUser = getLocalStorage('')
    //     setUser(savedUser)
    // });

    useEffect(() => {
        setLocalStorage("user", user);
    }, [user]);
    
    return (
        <UserContext.Provider value={valueUser}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider