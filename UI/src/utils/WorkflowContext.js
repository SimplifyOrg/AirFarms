import React from "react";

// set the defaults
const WorkflowContext = React.createContext({
  workflow: {},
  setWorkflow: () => {}
});

export default WorkflowContext;