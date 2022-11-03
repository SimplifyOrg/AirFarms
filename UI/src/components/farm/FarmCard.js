import React, {useContext} from 'react'
import {
    Text,
    VStack,
    Box,
    Image,
    useColorModeValue
} from '@chakra-ui/react'
import {Link, useNavigate} from 'react-router-dom'
import UserContext from '../../utils/UserContext'
import FarmContext from '../../utils/FarmContext'

function FarmCard(props) {
    const locale = 'en';
    const { user } = useContext(UserContext);
    const navigate = useNavigate()
    const { farm, setFarm } = useContext(FarmContext);
    

    const handleClick = () => {
        setFarm(props.farmBody.farm)
        navigate('/workflow-list')
    }
    // const date = new Date(props.postBody.date_posted)
    // //const [dateString, timeString, wish] = useDate(date)
    // const day = date.toLocaleDateString(locale, { weekday: 'long' });
    // const dateString = `${day}, ${date.getDate()} ${date.toLocaleDateString(locale, { month: 'long' })}\n\n`;
  
    // const hour = date.getHours();
    // const wish = `Good ${(hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'}, `;
  
    // const time = date.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' });
    //const dateString = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date)
    return (
        
            
                <Box
                maxW={'270px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}
                onClick={handleClick}
                borderWidth='1px'>
                    <VStack>
                        <Text noOfLines={1}>{props.farmBody.farm.name}</Text>  
                        <Image 
                        h={'120px'}
                        w={'full'}
                        src={props.farmBody.farmpicture.image}
                        objectFit={'cover'} />
                    </VStack>
                </Box>

    )
}

export default FarmCard
