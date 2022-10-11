import React from "react";

// set the defaults
const NodeContext = React.createContext({
  node: {},
  setNode: () => {}
});

export default NodeContext;