import React, {useState, useEffect} from 'react'
import { Card, CardBody, Tooltip, SimpleGrid, Avatar, Text, IconButton, HStack, Flex } from '@chakra-ui/react'
import { HiPlus } from "react-icons/hi2";
import { AuthProvider } from '../utils/AuthProvider'

function FarmUserSearchResults({results, farmGroup}) {

    const [picture, SetPicture] = useState(new Map())
    const addPicture = (key, value) => {
        SetPicture(new Map(picture.set(key, value)))
    }

    const [farmUsers, SetFarmUsers] = useState(new Map())
    const addFarmUsers = (key, value) => {
        SetFarmUsers(new Map(farmUsers.set(key, value)))
    }

    useEffect(() => {
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        let lis = Array.from(results.values())
        
        for( let i = 0; i < lis.length; ++i)
        {
           authProvider.authGet(`/account/profilepicture/?user=${lis[i].id}`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                addPicture(lis[i].id, res.data[0])                
            })
            .catch(error => {
                console.log(error);
            })

        }
    }, [results])

    useEffect(() => {

        if(farmGroup)
        {
            const authProvider = AuthProvider()
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }
            
            authProvider.authGet(`/account/user/?groups=${farmGroup.id}`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                res.data.forEach(element => {
                    addFarmUsers(element.id, element)
                });              
            })
            .catch(error => {
                console.log(error);
            })
        }

    }, [results])

    return (
        <SimpleGrid mt={10} spacing={2} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'
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
            {
                picture.size === 0? <></>: Array.from(picture.values()).map((pic, id) => {
                    if(pic !== undefined)
                    {
                        let name = (results.get(pic.user)).first_name;
                        return(
                            <Card size='sm'>                        
                                <CardBody>
                                    
                                    <Flex spacing='4'>
                                        <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                            <Avatar 
                                                src={pic.image}
                                            />
                                            <Text>{name}</Text>
                                        </Flex>
                                        {farmUsers.has(pic.user) === true? <></>: <Tooltip label='Add to current farm'><IconButton  variant='ghost'  colorScheme='teal' icon={<HiPlus />}/></Tooltip>}
                                    </Flex>                            
                                </CardBody>
                            </Card>
                        )
                    }
                    else
                    {
                        return(
                            <></>
                        )
                    }
                })
            }
        </SimpleGrid>
    )
}

export default FarmUserSearchResults