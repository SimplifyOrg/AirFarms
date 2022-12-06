import React, {useContext} from 'react'
import {
    Text,
    VStack,
    Box,
    Image,
    useColorModeValue,
    HStack,
    CloseButton
} from '@chakra-ui/react'
import {useNavigate} from 'react-router-dom'
import UserContext from '../../utils/UserContext'
import FarmContext from '../../utils/FarmContext'
import {AuthProvider} from '../../utils/AuthProvider'

function FarmCard(props) {
    const locale = 'en';
    const { user } = useContext(UserContext);
    const navigate = useNavigate()
    const { farm, setFarm } = useContext(FarmContext);
    

    const handleClick = () => {
        setFarm(props.farmBody.farm)
        navigate('/farm')
    }

    const archiveFarm = () => {

        let data = props.farmBody.farm;

        data.archived = true;        

        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        const authProvider = AuthProvider()
        authProvider.authPut(`/farm/perform/manage/${data.id}/`, data, config)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            navigate('/farms')        
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })

    }
    
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
                        <HStack><Text noOfLines={1}>{props.farmBody.farm.name}</Text><CloseButton size='sm' onClick={archiveFarm}/></HStack>
                        <Image 
                        h={'120px'}
                        w={'full'}
                        src={props.farmBody.farmpicture?.image}
                        objectFit={'cover'} />
                    </VStack>
                </Box>

    )
}

export default FarmCard
