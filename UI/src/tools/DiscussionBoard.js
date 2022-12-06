import React, {useState, useEffect, useContext} from 'react'
import {Form, Formik} from 'formik'
import FormikControl from '../components/FormikControl';
import { Button } from "@chakra-ui/button";
import {
    HStack,
    Box,
    Divider
} from '@chakra-ui/react'
import * as Yup from 'yup'
import Posts from '../components/discussion/Posts';
import {AuthProvider} from '../utils/AuthProvider'
import { EditorState, convertToRaw } from "draft-js"
import draftToHtml from "draftjs-to-html"
import CustomRichTextEditor from '../components/discussion/CustomRichTextEditor';
import parse from "html-react-parser"
import UserContext from '../utils/UserContext';
import DiscussionImageContext from '../utils/DiscussionImageContext';

function DiscussionBoard(props) {
    const [createdPosts, SetCreatedPosts] = useState(new Map())
    const addPostsInMap = (key, value) => {
        SetCreatedPosts(new Map(createdPosts.set(key, value)))
    }
    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    const {user} = useContext(UserContext)
    const {discussionImage, setDiscussionImage} = useContext(DiscussionImageContext)

    useEffect(() => {
        if(user.data)
        {
            //Runs only on the first render
            let config = {
            headers: {
                'Content-Type': 'application/json'
            }
            }
            const authProvider = AuthProvider()
            authProvider.authGet(`/discussion/posts/handle/?discussion=${props.discussion_id}&&ordering=-date_posted`, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                
                for(let i = 0; i <  res.data.length; ++i)
                {
                    addPostsInMap(res.data[i].id, res.data[i])
                }
            })
            .catch(error => {
                console.log(error);
            })

        }

    }, []);

    const onSubmit = async (values, onSubmitProps) => {
        //Call register API
        
        let date = new Date()

        const dateString = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        
        setEditorState(values.message)
        console.log(user.data.id);
        const post = {
            description: draftToHtml(convertToRaw(values.message.getCurrentContent())),
            date_posted : dateString.toString(),
            user : user.data.id,
            discussion : props.discussion_id
          };

        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        const authProvider = AuthProvider()
        authProvider.authPost(`/discussion/posts/handle/`, post, config, false)
          .then(async (res) => {
            console.log(res);
            console.log(res.data);
            addPostsInMap(res.data.id, res.data)
            onSubmitProps.resetForm()

            for(let i = 0; i < discussionImage.length; ++i)
            {
                const comment_id = {
                    post: res.data.post
                }
                await authProvider.authPatch(`/discussion/picture/posts/handle/${discussionImage[i].comment_pic_id}/`, comment_id, config)
                .then(res =>{
                    console.log(res);
                    console.log(res.data);
                })
                .catch(error => {  //Catch for Patch
                    console.log(error);
                    console.log(error.data);
                })
            }
          })
          .catch(error => { //Catch for POST
            console.log(error);
          })
          
        onSubmitProps.resetForm()
    }

    const validationSchema = Yup.object({
        message: Yup.object().required('Required')
    })

    if(user.data)
    {
        return (        
            <Formik
            initialValues={{ message: EditorState.createEmpty() }}
            onSubmit={onSubmit}
            validationSchema={validationSchema}>
            {formik => {
                // Sort post in descending order
                let postList = (Array.from(createdPosts.values()).sort(function(a, b){return b.id - a.id}))                
                return (                    
                    <Form>                        
                        <Box 
                            id="chatWindow"
                            p="6"
                            maxH="300px"
                            borderWidth="2px"
                            borderRadius="lg"
                            overflowY="auto"
                            css={{
                                '&::-webkit-scrollbar': {
                                    width: '4px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: 'orange',
                                    borderRadius: '24px',
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    background: '#555'
                                }
                                }}
                            >
                        {
                            createdPosts.size === 0 || postList.length === 0? <></>: postList.map((postBody, idx) => {
                            return(
                                <Box>
                                    <br/>
                                    <Posts key={idx} postBody={postBody}/>
                                    <Divider/>
                                    <br/>
                                </Box>
                            )
                            })
                        }
                        </Box>
                        <br/>
                        <CustomRichTextEditor name="message" />
                        <br/>
                        <HStack>
                            <Button 
                                type='submit' 
                                disabled={!formik.isValid}
                                width="full"
                                color="orange.400"
                            >
                                Submit
                            </Button>                
                            <Button 
                                type='reset'
                                width="full"
                                color="orange.400"
                            >
                                Reset
                            </Button>
                        </HStack>
                    </Form>
                )}
            }
            </Formik>
        )
    }
    else
    {
        return(
            <></>
        )
    }
}

export default DiscussionBoard
