import React, {useEffect, useState} from 'react'
import { AuthProvider } from '../../utils/AuthProvider';
import RoleUsers from './RoleUsers';

function Role({role}) {    

    return (
        <RoleUsers role={role}/>
    )
}

export default Role