import React from "react";
import { Link } from "react-router-dom";
import Login from '../components/Login'
// import ResetPassword from "../components/ResetPassword";
import {
    Text,
    Box, 
    Flex, 
    Heading,
    useColorModeValue,
    Image
} from '@chakra-ui/react'
import NavBar from "../components/navigation/NavBar";

function Signin() {
  return (
    <>
        <NavBar/>
        <div className={useColorModeValue("welcome-body-light", "welcome-body")}>
        <div className="container">
        <Flex 
        // backgroundImage={useColorModeValue("url('https://www.macmillandictionary.com/us/external/slideshow/thumb/134596_thumb.jpg')", "url('https://cdn.britannica.com/97/141297-050-5A5B37D7/fishing-nets-fishery-Kochi-India-Kerala.jpg')")}
        // // backgroundImage={useColorModeValue(<Image objectFit='cover' src='https://www.macmillandictionary.com/us/external/slideshow/thumb/134596_thumb.jpg'/>, <Image objectFit='cover' src='https://cdn.britannica.com/97/141297-050-5A5B37D7/fishing-nets-fishery-Kochi-India-Kerala.jpg'/>)}
        // backgroundPosition="center"
        // backgroundRepeat="no-repeat"
        className="row" width="full" align="center" justifyContent="center">
            <Box>
            <Box textAlign="center">
                <Heading color="orange.400">Login</Heading>
                <br/>
            </Box>
            <Box p="6" borderWidth="2px" borderRadius="lg">
                <Login/>
                <Text className="mt-2" color="orange.400">
                    Don't have an account? <Link to="/signup"><u>Signup</u></Link>
                </Text>
            </Box>
            </Box>
        </Flex>
        </div>
        </div>
    </>
  )
}

export default Signin