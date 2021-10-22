import {Helmet} from 'react-helmet';
import {Box, Container, Link, Modal, Typography} from '@material-ui/core';
import {AmplifyTheme, ChatBot} from 'aws-amplify-react';
import {useState} from "react";

const myTheme = {
    ...AmplifyTheme,
    sectionHeader: {
        ...AmplifyTheme.sectionHeader,
        backgroundColor: '#ff6600'
    }
};


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const LexChatBot = () => {

    const [open, setIsOpen] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleComplete = (err, confirmation) => {
        if (err) {
            setSuccess(false)
        }

        setIsOpen(true);
        setSuccess(true);
    }

    const handleClose = () => {
        setIsOpen(false);
    }
    return (
        <>
            <Helmet>
                <title>Chatbot</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                    marginTop: '50px'
                }}
            >
                <Container maxWidth="md">
                    <ChatBot
                        title="Fronty"
                        theme={myTheme}
                        botName="DeployMicroFrontendVOne"
                        welcomeMessage="Hi, I am Fronty! how can I help you?"
                        onComplete={() => handleComplete()}
                        clearOnComplete={true}
                        conversationModeOn={false}
                    />
                </Container>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Lex Chatbot result
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        {success &&
                            <>
                            You can check Piepline progress at: <Link href="https://eu-west-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/mfe-accounts/view?region=eu-west-1#">Code Pipeline</Link>
                            </>
                        }
                        {!success &&
                            <>
                                Problems during the chat, please retry.
                            </>
                        }
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}


export default LexChatBot;
