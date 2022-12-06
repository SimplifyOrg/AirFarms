import React from "react";

// set the defaults
const DiscussionImageContext = React.createContext({
    discussionImage: {},
    setDiscussionImage: () => {}
});

export default DiscussionImageContext;