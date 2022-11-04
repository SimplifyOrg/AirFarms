import React, {useState, useEffect, useContext} from 'react'
import { AuthProvider } from '../utils/AuthProvider';
import UserContext from '../utils/UserContext';
import {Link, useNavigate} from 'react-router-dom'
import {
    Box,
    Badge,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    SimpleGrid,
    useColorModeValue,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons';
import NavBar from '../components/navigation/NavBar';

function Dashboard() {

    const [numberFarms, SetNumberFarms] = useState(0)
    const [numberWorkflows, SetNumberWorkflows] = useState(0)
    const [reviews, SetReviews] = useState([])
    const [works, SetWorks] = useState([])
    const [overdueWorks, SetOverdueWorks] = useState([])
    const [upcomingWorks, SetUpcomingWorks] = useState([])
    const [haltedWorks, SetHaltedWorks] = useState([])
    const {user} = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if(user)
        {
            //Runs only on the first render
            // Get number of farms
            let config = {
            headers: {
                'Accept': 'application/json'
            }
            }
            const authProvider = AuthProvider()

            authProvider.authGet(`/farm/perform/manage/?user=${user.data.id}&&archived=${false}`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                SetNumberFarms(res.data.length)                      
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
                navigate('/logout')
            })

        }

    }, [user]);

    useEffect(() => {
        if(user)
        {
            //Runs only on the first render
            // Get number of active workflows
            let config = {
            headers: {
                'Accept': 'application/json'
            }
            }
            const authProvider = AuthProvider()

            authProvider.authGet(`/activity/workflow/handle/?owner=${user.data.id}&&archived=${false}&&is_production=true&&has_finished=false`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                SetNumberWorkflows(res.data.length)                         
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })

        }

    }, [user]);

    useEffect(() => {
        if(user)
        {
            //Runs only on the first render
            // Get pending approvals
            let config = {
            headers: {
                'Accept': 'application/json'
            }
            }
            const authProvider = AuthProvider()

            authProvider.authGet(`/activity/transition-approval/handle/?approver=${user.data.id}&&approval=false`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                SetReviews(res.data)
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })

        }

    }, [user]);

    useEffect(() => {
        if(user)
        {
            //Runs only on the first render
            // Get works assigned
            let config = {
            headers: {
                'Accept': 'application/json'
            }
            }
            const authProvider = AuthProvider()

            authProvider.authGet(`/activity/work/handle/?assignee=${user.data.id}&&has_finished=false`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                SetWorks(res.data)
                const current = new Date()

                // List of overdue work
                let overdue = []
                for(let i = 0; i < res.data.length; ++i)
                {
                    let completionDate = new Date(res.data[i].completion_date)
                    if(current.getTime() > completionDate.getTime())
                    {
                        overdue.push(res.data[i])
                    }
                }
                SetOverdueWorks(overdue.slice())

                // List of upcoming work
                let upcoming = []
                for(let i = 0; i < res.data.length; ++i)
                {
                    let startDate = new Date(res.data[i].start_date)
                    if(current.getTime() < startDate.getTime())
                    {
                        upcoming.push(res.data[i])
                    }
                }
                SetUpcomingWorks(upcoming.slice())
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })

            // Get list of work that is halted
            authProvider.authGet(`/activity/work/handle/?assignee=${user.data.id}&&is_halted=true`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                SetHaltedWorks(res.data)
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })

        }

    }, [user]);

    const handleClickFarms = () => {
        navigate('/farms')
    }

  return (
    <>
        <NavBar>
            <Breadcrumb marginBlock={1} spacing='8px'  overflow='hidden' separator={<ChevronRightIcon color='gray.500' />}>
                <BreadcrumbItem ml={1} isCurrentPage>
                    <BreadcrumbLink as={Link} to='/dashboard'>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box maxW='4xl'>
            <SimpleGrid columns={2} spacingX={1} >
            <Box marginBlock={1} display='flex' bg={useColorModeValue("orange.100", 'gray.700')} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' >
                <Stat onClick={handleClickFarms}>
                    <StatLabel>Farms</StatLabel>
                    <StatNumber>{numberFarms}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Active Workflows</StatLabel>
                    <StatNumber>{numberWorkflows}</StatNumber>
                </Stat>
            </Box>
            <Box marginBlock={1} display='flex' bg={useColorModeValue("orange.100", 'gray.700')} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' >
                <Stat>
                    <StatLabel>Pending Reviews</StatLabel>
                    <StatNumber>{reviews.length}</StatNumber>
                </Stat>
            </Box>
            <Box marginBlock={1} display='flex' bg={useColorModeValue("orange.100", 'gray.700')} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' >
                <Stat>
                    <StatLabel>Assigned Works</StatLabel>
                    <StatNumber>{works.length}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Overdue Works</StatLabel>
                    <StatNumber>{overdueWorks.length}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Halted Works</StatLabel>
                    <StatNumber>{haltedWorks.length}</StatNumber>
                </Stat>
            </Box>
            <Box marginBlock={1} display='flex' bg={useColorModeValue("orange.100", 'gray.700')} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' >
                <Stat>
                    <StatLabel>Upcoming Works</StatLabel>
                    <StatNumber>{upcomingWorks.length}</StatNumber>
                </Stat>
            </Box>
            </SimpleGrid>
            </Box>
     
        </NavBar>
    </>
    
  )
}

export default Dashboard