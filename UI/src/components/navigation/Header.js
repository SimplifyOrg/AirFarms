import React, { useContext, useEffect, useState } from 'react'
import MenuItems from './MenuItems'
import { Box, useColorModeValue } from "@chakra-ui/react"
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

    const [colormode, setColormode] = useState(useColorModeValue('orange.600', 'orange.400'))

    useEffect(() => {
        if(user?.data?.id !== undefined)
        {
            SetSigned(true)
        }
    }, [])

    {
    return (
            <Box>                
                {signed ? <></>: <MenuItems ml={2} color="orange.400" to="/">Home</MenuItems> }
                <NavMenu loggedin = {signed}/>
                {signed ? <Notifications/> : <></>}
                <IconButton colorScheme={'transparent'} backgroundColor='transparent' mr={2} ml={2} icon={isDark ? <SunIcon color={colormode}/> : <MoonIcon color={colormode}/>} onClick={toggleColorMode}></IconButton>            
            </Box>

        )
    }
}

export default Header
