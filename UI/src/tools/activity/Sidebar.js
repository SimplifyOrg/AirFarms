import React, {useContext} from 'react';
import Roles from './Roles';
import ExecutionContext from '../../utils/ExecutionContext';

export default (props) => {

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };
    const {execution} = useContext(ExecutionContext)

  return (
    <aside>
      {/* {execution !== null?<></>:<><div className="description">You can drag these nodes to the pane on the left.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Node
      </div></>} */}
      <Roles saveWorkflow={props.saveWorkflow}/>
      {/* <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Default Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div> */}
      {/* <Button onClick={onSave}>save</Button> */}
    </aside>
  );
};