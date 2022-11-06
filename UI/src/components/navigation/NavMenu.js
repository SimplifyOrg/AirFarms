import React from 'react'
import MenuItems from './MenuItems'
import {IconButton} from '@chakra-ui/button'
import { HamburgerIcon } from '@chakra-ui/icons'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from "@chakra-ui/react"
  import {Link} from 'react-router-dom'

function NavMenu(props) {

    const signedIn = props.loggedin

    if(signedIn)
    {
        return (
            // <Menu>
            //     <MenuButton
            //         as={IconButton}
            //         aria-label="Options"
            //         icon={<HamburgerIcon colorScheme={'transparent'}/>}
            //         variant="outline"
            //     />
            //     <MenuList>
            //         <MenuItem matchWidth={true} color="orange.400"><Link to="/profile">Profile</Link></MenuItem>
            //         <MenuItem matchWidth={true} color="orange.400"><Link to="/logout">Logout</Link></MenuItem>
            //     </MenuList>
            // </Menu>
            <MenuItems ml={2} color="orange.400" to="/logout">Logout</MenuItems>         
        )
    }
    else
    {
        return (            
                <MenuItems ml={2} color="orange.400" to="/login">Login</MenuItems>        
            )
    }
}

export default NavMenu
