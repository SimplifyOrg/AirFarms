import React from 'react'
import {Link} from 'react-router-dom'
import {
    Button, HStack, useColorModeValue, Grid, GridItem, Text, Spacer
} from '@chakra-ui/react'
import NavBar from '../components/navigation/NavBar'

function Home() {
  return (
    
    <>
    <NavBar/>
    <div className={useColorModeValue("welcome-body-light", "welcome-body")}>
      
      <div className="container">
        <HStack className="row">
            <Grid
                h='200px'
                templateRows='repeat(4, 1fr)'
                templateColumns='repeat(5, 1fr)'
                gap={4}
                >
                <GridItem rowSpan={2} colSpan={2}  />
                <GridItem rowSpan={2} colSpan={3}>
                    <Text fontSize='8xl' color='whiteAlpha.500'>Welcome</Text>
                    <Text color='whiteAlpha.700'>If you want to do it, we can get you closer to how!</Text>
                    <Spacer/>
                    <HStack ml={4} mt={2}>
                        <Link to="/login">
                            <Button colorScheme='teal' color='whiteAlpha.800' variant='outline'>
                                <strong >Log In</strong>
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button colorScheme='teal' color='whiteAlpha.800' variant='outline'>
                                <strong >Sign Up</strong>
                            </Button>
                        </Link>
                    </HStack>
                </GridItem>
                    
            </Grid>

        </HStack>
      </div>
    </div>
    </>
  )
}

export default Home