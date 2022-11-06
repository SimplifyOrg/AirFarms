import React, { Component } from "react";
import { Link } from "react-router-dom";
import Login from '../components/Login'
// import ResetPassword from "../components/ResetPassword";
import {
    Text,
    Box, 
    Flex, 
    Heading,
    HStack
} from '@chakra-ui/react'
import NavBar from "../components/navigation/NavBar";

class Signin extends Component {  
  render() {
    return (
        <>
        <NavBar/>
        <div className="welcome-body">
        <div className="container">
        <Flex className="row" width="full" align="center" justifyContent="center">
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
    );
  }

  componentDidMount(){
      
  }
}

export default Signin;