import React, {useState, useEffect, useContext} from 'react'
import {
    Grid,
    GridItem,
    Box
} from '@chakra-ui/react'
import FarmCard from './FarmCard'
import CreateFarmCard from './CreateFarmCard'
import {AuthProvider} from '../../utils/AuthProvider'
import UserContext from '../../utils/UserContext'

function FarmList(props) {

    const { user } = useContext(UserContext);
    let initialFarms = []
    const [farmList, SetFarmList] = useState(initialFarms)

    useEffect(() => {
        if(user)
        {
            //Runs only on the first render

            let config = {
            headers: {
                'Accept': 'application/json'
            }
            }
            const authProvider = AuthProvider()

            authProvider.authGet(`/farm/perform/manage/?user=${user.data.id}`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                for(let i = 0; i <  res.data.length; ++i)
                {
                    authProvider.authGet(`/farm/perform/manage/farmpicture/?farm=${res.data[i].id}`, config)
                    .then(resPic => {
                        console.log(resPic);
                        console.log(resPic.data);
                        const farmDetail = {
                            farm : res.data[i],
                            farmpicture : resPic.data
                        }           
                        initialFarms.push(farmDetail)
                        SetFarmList(initialFarms.slice())
                    })
                    .catch(error => {
                        console.log(error);
                        console.log(error.data);
                    })
                }            
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })

        }

    }, []);

    return (
        <Box 
            id="farmList"
            p="6"
            maxH="600px"
            borderWidth="2px"
            borderRadius="lg"
            overflowY="auto"
            css={{
                '&::-webkit-scrollbar': {
                    width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'orange',
                    borderRadius: '24px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555'
                }
                }}
            >
        <Grid templateColumns='repeat(5, 1fr)' gap={6}>
        {
            farmList.length === 0 ? <p>Loading...</p>: farmList.map((farmBody, idx) => {
            return(
                <GridItem>
                        <FarmCard key={idx} farmBody={farmBody}/>
                </GridItem>
            )
            })
        }
        <GridItem>
            <CreateFarmCard/>
        </GridItem>
        </Grid>
        </Box>
    )
}

export default FarmList
