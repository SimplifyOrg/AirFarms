import React from "react";

// set the defaults
const UserContext = React.createContext({
  user: {},
  setUser: () => {}
});

export default UserContext;