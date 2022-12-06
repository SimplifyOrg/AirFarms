import { 
    Input,
    InputGroup, 
    InputRightElement, 
    IconButton, 
    Center, 
    VStack,
    List,
    ListItem,
    Button
 } from '@chakra-ui/react'
import React, {useState, Fragment} from 'react'
import {SearchIcon} from '@chakra-ui/icons'

function Autocomplete({suggestions, performAction, searchAction}) {

    const [activeSuggestion, SetActiveSuggestion] = useState(0)
    const [filteredSuggestion, SetFilteredSuggestion] = useState([])
    const [showSuggestion, SetShowSuggestion] = useState(false)
    const [userInput, SetUserInput] = useState('')


    const onChange = (e) => {
        const userInput = e.currentTarget.value;

        // Filter our suggestions that don't contain the user's input
        const filteredSuggestions = suggestions.filter(
            suggestion =>
            suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        SetActiveSuggestion(0);
        SetFilteredSuggestion(filteredSuggestions);
        SetShowSuggestion(true);
        SetUserInput(e.currentTarget.value);

    };

    const onSearch = (e) => {
        if(searchAction !== null && searchAction !== undefined)
        {
            searchAction(userInput)
        }
    }
    
    const onClick = (e) => {
        SetActiveSuggestion(0);
        SetFilteredSuggestion([]);
        SetShowSuggestion(false);
        SetUserInput(e.currentTarget.innerText);
        if(performAction !== null && performAction !== undefined)
        {
            performAction(e.currentTarget.innerText);
        }
        
    };

    const onKeyDown = e => {

        // User pressed the enter key
        if (e.keyCode === 13) {
            SetFilteredSuggestion([]);
            SetShowSuggestion(false);
            SetUserInput(filteredSuggestion[activeSuggestion]);
        }
        // User pressed the up arrow
        else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }
            SetActiveSuggestion(activeSuggestion - 1);
        }
        // User pressed the down arrow
        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestion.length) {
                return;
            }
            SetActiveSuggestion(activeSuggestion + 1);
        }
    };

    let suggestionsListComponent;

    if (showSuggestion && userInput) 
    {
        if (filteredSuggestion.length) 
        {
            suggestionsListComponent = (
                <List width='100%' spacing={1} borderWidth='1px'>
                {filteredSuggestion.map((suggestion, index) => {
                let className;

                // Flag the active suggestion with a class
                if (index === activeSuggestion) {
                    className = "suggestion-active";
                }

                return (
                    <ListItem>
                        <Button width='100%' variant='ghost' colorScheme='teal' key={suggestion} onClick={onClick}>
                        {suggestion}
                        </Button>
                    </ListItem>
                );
                })}
            </List>
            );
        } 
        else 
        {
            suggestionsListComponent = (
            <></>
            );
        }
    }

    return (
        <Fragment>
            <VStack>
            <Center w='100%'>
            <InputGroup>
                <Input
                type="text"
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={userInput}
                />
                <InputRightElement children={<IconButton variant='ghost' onClick={onSearch} icon={<SearchIcon color='green.500'/>}/>} />
                
            </InputGroup>
            
            </Center>
            {suggestionsListComponent}
            </VStack>
        </Fragment>
    )
}

export default Autocomplete