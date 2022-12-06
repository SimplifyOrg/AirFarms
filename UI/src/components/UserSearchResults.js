import React, {useState, useEffect} from 'react'
import { Card, CardHeader, CardBody, CardFooter, SimpleGrid, Image, Text, Heading, Button, VStack } from '@chakra-ui/react'
import { AuthProvider } from '../utils/AuthProvider'

function UserSearchResults({results}) {

    const [picture, SetPicture] = useState(new Map())
    const addPicture = (key, value) => {
        SetPicture(new Map(picture.set(key, value)))
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
    }, [])

    return (
        <SimpleGrid mt={10} spacing={2} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
            {
                picture.size === 0? <></>: Array.from(picture.values()).map((pic, id) => {
                    let name = (results.get(pic.user)).first_name;
                    let about = (results.get(pic.user)).about;
                    return(
                    <Card size='sm'>
                        <CardHeader>
                            <Heading size='md'>{name}</Heading>
                        </CardHeader>
                        
                        <CardBody>
                            <VStack>
                            <Image
                                objectFit='cover'
                                src={pic.image}
                                boxSize='50%'
                            />
                            <Text>{about}</Text>
                            </VStack>
                        </CardBody>
                        <CardFooter>
                            <Button>View here</Button>
                        </CardFooter>
                    </Card>
                    )
                })
            }
        </SimpleGrid>
    )
}

export default UserSearchResults