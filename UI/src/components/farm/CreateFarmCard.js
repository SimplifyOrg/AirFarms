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
    // const date = new Date(props.postBody.date_posted)
    // //const [dateString, timeString, wish] = useDate(date)
    // const day = date.toLocaleDateString(locale, { weekday: 'long' });
    // const dateString = `${day}, ${date.getDate()} ${date.toLocaleDateString(locale, { month: 'long' })}\n\n`;
  
    // const hour = date.getHours();
    // const wish = `Good ${(hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'}, `;
  
    // const time = date.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' });
    //const dateString = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date)
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
                                <NewFarm/>
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
