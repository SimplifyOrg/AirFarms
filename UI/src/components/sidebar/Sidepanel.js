import React, {useState, useContext} from 'react'
import {
    Box,
    IconButton,
    Flex,
    Heading,
    Text,
    Avatar,
    VStack,
    useColorModeValue
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import UserContext from '../../utils/UserContext'

function Sidepanel() {

    const {user} = useContext(UserContext)
  return (
    <Flex
        w="100%"
        flexDir="column"
        alignItems="center"
        backgroundColor={useColorModeValue("orange.100", 'gray.700')}
        color="orange.400"
        maxW="130px"
    >
        <Flex
            flexDir="column"
            justifyContent="space-between"
            height="90%"
        >
            <Flex flexDir="column" as="nav">
                <Flex
                    flexDir="column"
                    align="flex-start"
                    justifyContent="center"
                >
                    <Flex className='sidebar-items'>
                        <Link _hover={{textDecor:'none'}} to='/dashboard'>
                            <Text className="active">Dashboard</Text>
                        </Link>
                    </Flex>
                    <Flex className='sidebar-items'>
                        <Link _hover={{textDecor:'none'}} to='/farms'>
                            <Text>Farms</Text>
                        </Link>
                    </Flex>
                    <Flex className='sidebar-items'>
                        <Link _hover={{textDecor:'none'}}>
                            <Text>Workflows</Text>
                        </Link>
                    </Flex>
                    {/* <Flex className='sidebar-items'>
                        <Link _hover={{textDecor:'none'}}>
                            <Text>Calender</Text>
                        </Link>
                    </Flex> */}
                </Flex>
            </Flex>
            <Flex flexDir="column" alignItems="center" mb={10} mt={5}>
                <Avatar my={2} name={user.data.first_name +' '+ user.data.last_name}  src={user.picture.image}/>
                <Text>{user.data.first_name}</Text>
                <Text>{user.data.last_name}</Text>
            </Flex>
        </Flex>

    </Flex>
  )
}

export default Sidepanel