import React, { useContext, useEffect, useState } from 'react'
import MenuItems from './MenuItems'
import { Box } from "@chakra-ui/react"
import { useColorMode } from "@chakra-ui/color-mode";
import { MoonIcon, SunIcon, BellIcon } from '@chakra-ui/icons'
import {IconButton} from '@chakra-ui/button'
import NavMenu from './NavMenu';
import Notifications from '../../tools/Notifications'
import UserContext from '../../utils/UserContext';

function Header() {

    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";  
    const [signed, SetSigned] = useState(false)
    
    const {user} = useContext(UserContext)

    useEffect(() => {
        if(user?.data?.id !== undefined)
        {
            SetSigned(true)
        }
    }, [])

    {
    return (
            <Box>                
                {signed ? <MenuItems ml={2} colorScheme={'transparent'} color="orange.400" to="/dashboard">Dashboard</MenuItems>: <MenuItems ml={2} color="orange.400" to="/">Home</MenuItems> }
                <NavMenu loggedin = {signed}/>
                {signed ? <Notifications/> : <></>}
                <IconButton colorScheme={'transparent'} backgroundColor='transparent' mr={2} ml={2} icon={isDark ? <SunIcon color="orange.600"/> : <MoonIcon color="orange.600"/>} onClick={toggleColorMode}></IconButton>            
            </Box>

        )
    }
}

export default Header
