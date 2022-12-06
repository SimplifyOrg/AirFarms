import React, {useContext, useEffect, useState} from 'react'
import NavBar from '../components/navigation/NavBar'
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Text,
    Image,
    HStack,
    Heading,
    Button,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    VStack,
    Grid,
    GridItem,
    SimpleGrid
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons';
import {Link} from 'react-router-dom'
import FarmContext from '../utils/FarmContext';
import WorkflowList from '../components/workflow/WorkflowList';
import { AuthProvider } from '../utils/AuthProvider';
import ExecutionComp from '../tools/activity/ExecutionComp';
import AddPeopleFarm from '../components/AddPeopleFarm';

function Farm() {
    const {farm} = useContext(FarmContext)
    const [picture, SetPicture] = useState(null)

    useEffect(() => {

        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        
        authProvider.authGet(`/farm/perform/manage/farmpicture/?farm=${farm.id}&&profilePicture=${true}`, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            SetPicture(res.data[0])                
        })
        .catch(error => {
            console.log(error);
        })

    }, [])

    return (
        <NavBar>
            <Breadcrumb marginBlock={1} spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to='/dashboard'>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to='/farms'>Farms</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink as={Link} to='/farm'>{farm === undefined || farm === '' || farm === null? 'Farm':farm.name}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Grid
            templateRows='repeat(2, 1fr)'
            templateColumns='repeat(5, 1fr)'
            gap={4}
            >
                <GridItem colSpan={1}>
                    <Card mt={1}>
                        <CardHeader>
                            <Heading size='md'>{farm.name}</Heading>
                        </CardHeader>
                        <CardBody>
                            <VStack>
                                    {picture === null || picture === undefined? <></>:<Image
                                        objectFit='cover'
                                        src={picture.image}
                                        boxSize='50%'
                                    />}
                                <Text>{farm.description}</Text>
                            </VStack>
                        </CardBody>
                        <CardFooter>
                            <Button>View here</Button>
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem colSpan={3}><ExecutionComp maxWidth="50%"/></GridItem>
                <GridItem rowSpan={2} colSpan={1} mt={1}><AddPeopleFarm farm={farm}/></GridItem>
                <GridItem colSpan={4}><WorkflowList/></GridItem>
                
            </Grid>
        </NavBar>
    )
}

export default Farm