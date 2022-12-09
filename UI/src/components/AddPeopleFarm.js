import { VStack } from '@chakra-ui/react'
import React, {useContext, useState, useEffect, useCallback} from 'react'
import Autocomplete from './Autocomplete'
import UserContext from '../utils/UserContext'
import { AuthProvider } from '../utils/AuthProvider'
import FarmUserSearchResults from './FarmUserSearchResults'

function AddPeopleFarm({farm}) {

    const {user} = useContext(UserContext)

    const [farmGroup, SetFarmGroup] = useState(null)

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

    useEffect(() => {

        if(farm)
        {
            const authProvider = AuthProvider()
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }
            let groupName = farm.name+'_'+farm.description+'_group'
            authProvider.authGet(`/farm/perform/group/?name=${groupName}&&farm=${farm.id}&&ordering=name`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                SetFarmGroup(res.data[0])                   
            })
            .catch(error => {
                console.log(error);
            })
        }
    }, [])

    const searchAction = useCallback((searchString) => {
        
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        clearSearchedUsers()
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
       
    }, [])

    return (
        <VStack>
            <Autocomplete placeholder='Search People ...' suggestions={Array.from(allUsers.values())} performAction={searchAction} searchAction={searchAction}/>
            {searchedUsers.size === 0? <></>: <FarmUserSearchResults results={searchedUsers} farmGroup={farmGroup}/>}
        </VStack>
    )
}

export default AddPeopleFarm