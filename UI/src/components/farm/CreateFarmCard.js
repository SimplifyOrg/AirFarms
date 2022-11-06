import React, {useContext} from 'react'
import {
    VStack,
    Box,
    Portal,
    useColorModeValue,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import NewFarm from './NewFarm'
import UserContext from '../../utils/UserContext'

function CreateFarmCard(props) {
    const locale = 'en';
    const { user } = useContext(UserContext);
    
    return (
        
            // <Link to="/create-farm">
                <Box
                maxW={'270px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                rounded={'md'}
                overflow={'hidden'}
                borderWidth='3px'
                borderStyle="dotted">
                    <VStack>
                        <Popover>
                        <PopoverTrigger>
                            <AddIcon
                            ml="10px"
                            mr="10px"
                            mt="10px"
                            mb="10px"
                            h={'140px'}
                            w={'full'}
                            overflow={'hidden'}
                            />
                        </PopoverTrigger>
                        <Portal>
                            <PopoverContent>
                            <PopoverArrow />
                            <PopoverHeader>Header</PopoverHeader>
                            <PopoverCloseButton />
                            <PopoverBody>
                                <NewFarm updateFarmList={props.updateFarmList}/>
                            </PopoverBody>
                            </PopoverContent>
                        </Portal>
                        </Popover>
                        
                    </VStack>
                </Box>                                 
            // </Link>

    )
}

export default CreateFarmCard
