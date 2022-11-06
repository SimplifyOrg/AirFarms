import React, {useState, useEffect, useContext, useCallback} from 'react'
import {
    Grid,
    GridItem,
    Box,
    Text,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    useToast,
    Skeleton
} from '@chakra-ui/react'
import {Link} from 'react-router-dom'
import { ChevronRightIcon } from '@chakra-ui/icons';
import FarmCard from './FarmCard'
import CreateFarmCard from './CreateFarmCard'
import {AuthProvider} from '../../utils/AuthProvider'
import UserContext from '../../utils/UserContext'
import NavBar from '../navigation/NavBar'

function FarmList(props) {

    const { user } = useContext(UserContext);
    let initialFarms = []
    let initialFarmsSet = new Set()
    const [farmList, SetFarmList] = useState(initialFarms)
    const toast = useToast()
    const [loading, setLoading] = useState(true)

    const updateFarmList = useCallback ((farm) => {
        if(user)
        {
            let config = {
            headers: {
                'Accept': 'application/json'
            }
            }
            const authProvider = AuthProvider()
            setLoading(true)
            authProvider.authGet(`/farm/perform/manage/?user=${user.data.id}&&archived=${false}&&ordering=date_created`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                
                for(let i = 0; i <  res.data.length; ++i)
                {
                    const farmDetail = {
                        farm : res.data[i],
                        farmpicture : null
                    }
                    if(!initialFarmsSet.has(farmDetail.farm.id))
                    {
                        initialFarmsSet.add(farmDetail.farm.id)
                        initialFarms.push(farmDetail)
                        SetFarmList(initialFarms.slice())
                    }
                    
                    authProvider.authGet(`/farm/perform/manage/farmpicture/?farm=${res.data[i].id}`, config)
                    .then(resPic => {
                        console.log(resPic);
                        console.log(resPic.data);
                        initialFarms[i].farmpicture = resPic.data
                        SetFarmList(initialFarms.slice())                        
                    })
                    .catch(error => {
                        console.log(error);
                        console.log(error.data);
                    })
                }
                setLoading(false)          
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
                setLoading(false)
                toast({
                    position: 'top',
                    title: `Unable to load all farms`,
                    description: `Please reaload the page to try again`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                  })
            })
        }

    }, [])

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

            authProvider.authGet(`/farm/perform/manage/?user=${user.data.id}&&archived=${false}&&ordering=date_created`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                for(let i = 0; i <  res.data.length; ++i)
                {
                    const farmDetail = {
                        farm : res.data[i],
                        farmpicture : null
                    }

                    if(!initialFarmsSet.has(farmDetail.farm.id))
                    {
                        initialFarmsSet.add(farmDetail.farm.id)
                        initialFarms.push(farmDetail)
                        SetFarmList(initialFarms.slice())
                    }
                    
                    authProvider.authGet(`/farm/perform/manage/farmpicture/?farm=${res.data[i].id}`, config)
                    .then(resPic => {
                        console.log(resPic);
                        console.log(resPic.data);
                        initialFarms[i].farmpicture = resPic.data
                        SetFarmList(initialFarms.slice())                        
                    })
                    .catch(error => {
                        console.log(error);
                        console.log(error.data);
                    })
                }
                setLoading(false)
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
                setLoading(false)
                toast({
                    position: 'top',
                    title: `Sorry couldn't get your farms!`,
                    description: `Please try again in sometime.`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                  })
            })

        }

    }, []);

    return (

        <NavBar>
            <Breadcrumb marginBlock={1} spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to='/dashboard'>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink as={Link} to='/farms'>Farms</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box 
                id="farmList"
                maxH="600px"
                alignItems="center"
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
                <Skeleton isLoaded={!loading} noOfLines={4} spacing='4'>
                    <Grid templateColumns='repeat(4, 1fr)' gap={6}>
                        <GridItem>
                            <CreateFarmCard updateFarmList={updateFarmList}/>
                        </GridItem>
                        {
                            farmList.length === 0 ? <Text>No activity here, add farms...</Text>: farmList.map((farmBody, idx) => {
                            return(
                                <GridItem>
                                        <FarmCard key={idx} farmBody={farmBody}/>
                                </GridItem>
                            )
                            })
                        }
                    
                    </Grid>
                </Skeleton>
            </Box>
        </NavBar>
    )
}

export default FarmList
