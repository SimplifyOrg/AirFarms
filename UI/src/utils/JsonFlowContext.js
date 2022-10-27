import React from "react";

// set the defaults
const JsonFlowContext = React.createContext({
  jsonFlow: {},
  setJsonFlow: () => {}
});

export default JsonFlowContext;