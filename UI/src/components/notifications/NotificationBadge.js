import { Box, IconButton, Text } from '@chakra-ui/react';
import { css } from '@emotion/react';
//import { FaBell } from '@react-icons/fa';
import { BellIcon } from '@chakra-ui/icons'

function NotificationBadge (props) {
    return (
        <IconButton
            css={css`
              position: relative !important;
            `}
            colorScheme={'transparent'}
            aria-label={'Notifications'}
            size={'md'}
            icon={<>
                <BellIcon color={'orange.600'} />
                <Box as={'span'} color={'white'} position={'absolute'} top={'6px'} right={'4px'} fontSize={'0.8rem'}
                     borderRadius={'l3g'} zIndex={9999} p={'1px'}>
                    <Text color='red'>{props.count}</Text>
                </Box>
            </>}
        />
    );
}

export default NotificationBadge;