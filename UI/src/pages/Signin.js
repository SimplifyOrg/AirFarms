import React, { Component } from "react";
import { Link } from "react-router-dom";
import Login from './Login'
// import ResetPassword from "../components/ResetPassword";
import {
    Text,
    Box, 
    Flex, 
    Heading
} from '@chakra-ui/react'
// import NavBar from "../components/NavBar";

class Signin extends Component {  
  render() {
    return (
    <div>
      {/* <NavBar/> */}
      <Flex width="full" align="center" justifyContent="center">
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
    );
  }

  componentDidMount(){
      
  }
}

export default Signin;