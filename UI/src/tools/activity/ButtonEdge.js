import React, {useState, useCallback, useEffect} from 'react';
import { getBezierPath, getEdgeCenter, getMarkerEnd } from 'react-flow-renderer';
import { 
    AvatarGroup,
    Avatar,
    Button,
    Portal,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    PopoverBody,
    Text,
    HStack
 } from '@chakra-ui/react';
 import { ChevronDownIcon } from '@chakra-ui/icons'



import './css/edgeButton.css';
import Transition from './Transition';

const foreignObjectSize = 40;

// const onEdgeClick = (evt, id) => {
//   evt.stopPropagation();
//   alert(`remove ${id}`);
// };

export default function CustomEdge({
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    style = {},
    markerEnd,
  }) {
    const edgePath = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });

    
    const inputEdge = {
        id: id,
        source: source,
        target: target,
        type: 'buttonedge',
        sourceHandle: "a",
        animated: true,
        data: { 
            label:'Approval', 
            text: 'New transition',
            transition: 
            {
                id: "1",
                previous: source,
                next: target,
                associatedFlow: "1",
                need_approval: false,
                transitionapprovals: []
            }
        }
    }

    let initialApprovers = []
    let approverUsers = new Set()
    const [approvers, SetApprovers] = useState(initialApprovers)
    const [boxColor, SetBoxColor] = useState('green')

    const addApprover = useCallback((user) => {
        
        if(!approverUsers.has(user.approver.id))
        {
            approverUsers.add(user.approver.id)
            initialApprovers.push(user)
            SetApprovers(initialApprovers.slice())
        }
        
        if(boxColor === 'green' && initialApprovers.length !== 0)
        {
            SetBoxColor('red')
        }
    }, [approvers]);

    useEffect(() => {
        // console.log(approvers)
        if(approvers.length !== 0)
        {
            SetBoxColor('red')
        }
        else
        {
            SetBoxColor('green')
        }
    }, [approvers])
  
    return (
      <>
        <path
          id={id}
          style={style}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        <foreignObject
          width={foreignObjectSize}
          height={foreignObjectSize}
          x={edgeCenterX - foreignObjectSize / 2}
          y={edgeCenterY - foreignObjectSize / 2}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <body>
            {/* <button className="edgebutton" onClick={(event) => onEdgeClick(event, id)}>
              ×
            </button> */}
                        
            <Popover>
                <PopoverTrigger>
                    <Button colorScheme={boxColor} size={8} variant='outline'>
                        <AvatarGroup size='xs' max={2}>
                            {
                                approvers.length === 0 ? <ChevronDownIcon size='xs'/>: approvers.map((approver, idx) => {
                                return(
                                    <Avatar key={idx} name={approver.first_name+' '+approver.last_name} src={approver.picture} />
                                )
                                })
                            }
                        </AvatarGroup>
                    </Button>
                </PopoverTrigger>
                <Portal>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader>Transition Approval</PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                            <Transition addApprover={addApprover} edge={inputEdge}/>
                        </PopoverBody>
                    </PopoverContent>
                </Portal>
            </Popover>
        
          </body>
        </foreignObject>
      </>
    );
  }
  