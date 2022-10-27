import React, {useState, useContext, useEffect} from "react"
import NavBarBox from "./NavBarBox"
import Header from "./Header"
import Logo from "./Logo"
import { Spacer, HStack } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/layout";
import Sidepanel from "../sidebar/Sidepanel";
import UserContext from "../../utils/UserContext";

const NavBar = ({ children, ...props }) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [signed, SetSigned] = useState(false)
    
    const {user} = useContext(UserContext)

    useEffect(() => {
        if(user?.data?.id !== undefined)
        {
            SetSigned(true)
        }
    }, [])
  
    const toggle = () => setIsOpen(!isOpen)
  
    return (
        <>
        <NavBarBox {...props}>
            <Logo
            w="100px"
            color={["black", "black", "primary.500", "primary.500"]}
            />
            <Spacer></Spacer>
            <Header isOpen={isOpen} />

        </NavBarBox>
        {signed ? <HStack><Flex h="100vh" flexDir="row" overflow="hidden" maxW="2000px"><Sidepanel /></Flex><Flex w="100%" flexDir="column" minH="100vh" overflow="auto">{children}</Flex></HStack>: <></> }   
        </>
    )
  }

  export default NavBar