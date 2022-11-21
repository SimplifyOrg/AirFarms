import React from "react";

// set the defaults
const ExecutionContext = React.createContext({
  execution: {},
  setExecution: () => {}
});

export default ExecutionContext;