import React, {useContext} from 'react'
import { Box, Grid, GridItem } from "@chakra-ui/react"
import UserContext from '../utils/UserContext'
import ProfilePicture from '../components/profile/ProfilePicture'
import NavBar from '../components/navigation/NavBar'

function UserProfile() {

    const {user} = useContext(UserContext)
    return (
        <NavBar>
            <Grid
            display='flex'
            templateRows='repeat(2, 1fr)'
            templateColumns='repeat(5, 1fr)'
            gap={4}
            >
                <GridItem rowSpan={2} colSpan={1}>
                    <Box display="flex" alignItems="left" justifyContent="space-between" ml="2">
                        <ProfilePicture user={user}/>
                    </Box>
                </GridItem>
                <GridItem colSpan={2}  />
                <GridItem colSpan={2}  />
                <GridItem colSpan={4}  />
            </Grid>
        </NavBar>
        
        
    )
}

export default UserProfile
