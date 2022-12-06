import React, {useState, useEffect} from 'react'
import useLocalStorage from './useLocalStorage'
import DiscussionImageContext from './DiscussionImageContext';

function DiscussionImageProvider({children}) {
    const {setLocalStorage, getLocalStorage} = useLocalStorage()
    const [discussionImage, setDiscussionImage] = useState(() => getLocalStorage("discussionImage", ''));
    const valueDiscussionImage = { discussionImage, setDiscussionImage };

    useEffect(() => {
        setLocalStorage("discussionImage", discussionImage);        
    }, [discussionImage]);

    return (
        <DiscussionImageContext.Provider value={valueDiscussionImage}>
            {children}
        </DiscussionImageContext.Provider>
    )
}

export default DiscussionImageProvider