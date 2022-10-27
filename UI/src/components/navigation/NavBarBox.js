import React from "react"
import { Flex, VStack } from "@chakra-ui/layout"

const NavBarBox = ({ children, ...props }) => {
    return (
      <VStack backgroundColor="orange.100">
        <Flex w="100%">
            {children}
        </Flex>
      </VStack>
    )
  }

  export default NavBarBox
  