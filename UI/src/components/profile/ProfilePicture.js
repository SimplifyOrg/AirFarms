import { 
    useCallback,
    useContext,
    useState
} from 'react';
import {
    Heading,
    Avatar,
    Box,
    Center,
    Image,
    Flex,
    Text,
    Stack,
    IconButton,
    useColorModeValue,
    Portal,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    PopoverBody,
  } from '@chakra-ui/react';
  import {EditIcon} from '@chakra-ui/icons'
  import EditableComponent from '../EditableComponent'
  import { AuthProvider } from '../../utils/AuthProvider';
  import UserContext from '../../utils/UserContext';
import UpdatePicture from './UpdatePicture';
  
  export default function ProfilePicture(props) {

    const {user, setUser} = useContext(UserContext)
    const [hover, setHover] = useState(false);
    const [holdhover, setHoldhover] = useState(false);

    const handleMouseIn = () => {
        setHover(true);
    };

    const handleMouseOut = () => {
        if(!holdhover)
        {
            setHover(false);
        }
        
    };
    
    const updateUser = (data) => {
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

            authProvider.authPatch(`/account/user/${user.data.id}/`, data, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })

        }
    }

    const updateAbout = useCallback((about) => {
        const data = {
            about: about
        }
        
        updateUser(data)
        let updatedUser = user;
        updatedUser.data.about = data.about;
        setUser(updatedUser)
        
    }, []);

    const updateFirstName = useCallback((name) => {

        const data = {
            first_name: name
        }
        
        updateUser(data)
        let updatedUser = user;
        updatedUser.data.first_name = data.first_name;
        setUser(updatedUser)
        
    }, []);

    const updateLastName = useCallback((name) => {

        const data = {
            last_name: name
        }
        
        updateUser(data)
        let updatedUser = user;
        updatedUser.data.last_name = data.last_name;
        setUser(updatedUser)
        
    }, []);

    const updatePicture = useCallback((data) => {

        let updatedUser = user;
        updatedUser.picture = data.image;
        setUser(updatedUser)
        
    }, []);

    return (
      <Center py={6}>
        <Box
          maxW={'270px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'md'}
          overflow={'hidden'}>
          <Image
            h={'120px'}
            w={'full'}
            src={
              'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
            }
            objectFit={'cover'}
          />
          <Flex justify={'center'} mt={-12}>
            <Avatar
              size={'xl'}
              src={
                user.picture
              }
              name={user.data.first_name+' '+user.data.last_name}
              css={{
                border: '2px solid white',
              }}
              onMouseOver={handleMouseIn} onMouseOut={handleMouseOut}
            >
                {hover?<Popover isLazy onOpen={()=>{setHoldhover(true)}} onClose={()=>{setHoldhover(false)}}>
                <PopoverTrigger>
                    <IconButton icon={<EditIcon/>}/>
                </PopoverTrigger>
                <Portal>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader>New document</PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                            <UpdatePicture updatePicture={updatePicture}/>
                        </PopoverBody>
                    </PopoverContent>
                </Portal>
            </Popover>:<></>}
            </Avatar>
          </Flex>
  
          <Box p={6}>
            <Stack spacing={0} align={'center'} mb={5}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                <EditableComponent color={'gray.500'} defaultValue={props.user.data.first_name} updateTitle={updateFirstName}/>
                <EditableComponent color={'gray.500'} defaultValue={props.user.data.last_name} updateTitle={updateLastName}/>
              </Heading>
              <EditableComponent color={'gray.500'} defaultValue={props.user.data.about} updateTitle={updateAbout}/>
            </Stack>
          </Box>
        </Box>
      </Center>
    );
  }
  