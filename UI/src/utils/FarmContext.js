import React from "react";

// set the defaults
const FarmContext = React.createContext({
  farm: {},
  setFarm: () => {}
});

export default FarmContext;