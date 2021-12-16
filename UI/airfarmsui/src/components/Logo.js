import React from 'react'
import { Box, Text } from "@chakra-ui/react"

function Logo(props) {
    return (
    <Box {...props}>
      <Text fontSize="lg" fontWeight="bold" color="orange.400">
        AirFarms
      </Text>
    </Box>
    )
}

export default Logo
