import React, {useContext, useState, useEffect, useCallback} from 'react'
import Autocomplete from '../components/Autocomplete'
import NavBar from '../components/navigation/NavBar'
import {
    Center,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from '@chakra-ui/react'
import UserContext from '../utils/UserContext'
import { AuthProvider } from '../utils/AuthProvider'
import UserSearchResults from '../components/UserSearchResults'
import { ChevronRightIcon } from '@chakra-ui/icons';
import {Link} from 'react-router-dom'

function Members() {

    const {user} = useContext(UserContext)

    const [groupUsers, SetGroupUsers] = useState(new Map())
    const addGroupUsers = (key, value) => {
        SetGroupUsers(new Map(groupUsers.set(key, value)))
    }

    const [allUsers, SetAllUsers] = useState(new Map())
    const addAllUsers = (key, value) => {
        SetAllUsers(new Map(allUsers.set(key, value)))
    }

    const [searchedUsers, SetSearchedUsers] = useState(new Map())
    const addSearchedUsers = (key, value) => {
        SetSearchedUsers(new Map(searchedUsers.set(key, value)))
    }
    const clearSearchedUsers = () => {
        SetSearchedUsers(new Map(searchedUsers.clear()))
    }

    useEffect(() => {

        if(user)
        {
            const authProvider = AuthProvider()
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }

            for(let i = 0; i < user.data.groups.length; ++i)
            {
                authProvider.authGet(`/account/user/?groups=${user.data.groups[i]}&&ordering=first_name`, config)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    addGroupUsers(user.data.groups[i], res.data)
                    res.data.forEach(element => {
                        addAllUsers(element.id, `${element.first_name} ${element.last_name}`)
                    });                    
                })
                .catch(error => {
                    console.log(error);
                })
            }
        }
    }, [searchedUsers])

    const searchAction = useCallback((searchString) => {
        
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        clearSearchedUsers();

        authProvider.authGet(`/account/user/?search=${searchString}&&ordering=-first_name`, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            res.data.forEach(element => {
                addAllUsers(element.id, `${element.first_name} ${element.last_name}`);
                addSearchedUsers(element.id, element);
            });
        })
        .catch(error => {
            console.log(error);
        })
       
    }, [searchedUsers])

    return (
        <NavBar>
            <Breadcrumb marginBlock={1} spacing='8px'  overflow='hidden' separator={<ChevronRightIcon color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to='/dashboard'>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem ml={1} isCurrentPage>
                    <BreadcrumbLink as={Link} to='/members'>Members</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Center>
                <Autocomplete placeholder='Search People ...' suggestions={Array.from(allUsers.values())} performAction={searchAction} searchAction={searchAction}/>
            </Center>
            {searchedUsers.size === 0? <></>: <UserSearchResults results={searchedUsers}/>}
        </NavBar>
    )
}

export default Members