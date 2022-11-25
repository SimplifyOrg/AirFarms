import { Image } from '@chakra-ui/react'
import React from 'react'

function DocumentThumbnail({doc}) {
    return (
        <a href={doc.file}>
            <Image
                boxSize='10px'
                objectFit='cover'
                src={doc.file}
                alt={doc.title === undefined? 'Document' : doc.title}
            />
        </a>
    )
}

export default DocumentThumbnail