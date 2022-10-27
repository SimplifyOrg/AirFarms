import React from "react"
import { Button } from "@chakra-ui/button"
import {Link} from 'react-router-dom'


const MenuItems = ({ children, isLast, to = "/", ...rest }) => {
    return (      
        <Link to={to}>
            <Button {...rest} variant="ghost">
              {children}
            </Button>
        </Link>
    )
  }

  export default MenuItems