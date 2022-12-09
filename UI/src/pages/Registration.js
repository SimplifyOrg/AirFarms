import React from 'react'
import Signup from '../components/Signup';
import NavBar from '../components/navigation/NavBar';
import {
    Box, 
    Flex, 
    Heading,
    Text,
    useColorModeValue
} from '@chakra-ui/react'
import {Link} from 'react-router-dom'

function Registration() {
    return (
        <>
        <NavBar/>
        <div className={useColorModeValue("welcome-body-light", "welcome-body")}>
        <div className="container">
            <Flex className="row" width="full" align="center" justifyContent="center">
                <Box>
                    <Box textAlign="center">
                        <Heading color="orange.400">Signup</Heading>
                        <br/>
                    </Box>
                    <Box p="6" borderWidth="2px" borderRadius="lg">
                        <Signup/>
                        <Text className="mt-2" color="orange.400">
                            Already have account? <Link to="/login"><u>Login</u></Link>
                        </Text>
                    </Box>
                </Box>
            </Flex>
        </div>
        </div>
        </>
        
    )
}

export default Registration
