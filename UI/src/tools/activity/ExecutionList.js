import React, {useState, useEffect} from 'react'
import { AuthProvider } from '../../utils/AuthProvider'
import Execution from './Execution'
import ExecutionCard from './ExecutionCard'
import {
    Td,
    Tr
} from '@chakra-ui/react'

function ExecutionList({workflow, executions}) {    
    
    // useEffect(() => {
    //     const authProvider = AuthProvider()
    //     let config = {
    //         headers: {
    //             'Accept': 'application/json'
    //         }
    //     }
    //     let user = null;
    //     authProvider.authGet(`/account/user/?id=${execution.initiater}`, config)
    //     .then(res => {
    //         console.log(res);
    //         console.log(res.data);
    //         user = res.data[0];
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     })
    // }, [])

    return (

        <>            
            {
                executions === undefined || executions.length === 0? <p></p>: executions.map((execution, idx) => {                    
                    return(
                        <Tr>
                            <Td>{workflow.workflow.title}</Td>
                            <Td><ExecutionCard execution={execution} workflow={workflow}/></Td>
                            <Td>{execution.initiater}</Td>
                        </Tr>
                    )
                })
            }
        </>

    )
}

export default ExecutionList