import React from "react"
import { Flex, VStack, useColorModeValue } from "@chakra-ui/react"

const NavBarBox = ({ children, ...props }) => {
    return (
      <VStack backgroundColor={useColorModeValue("orange.100", 'gray.700')}>
        <Flex w="100%">
            {children}
        </Flex>
      </VStack>
    )
  }

  export default NavBarBox
  