'use strict';

const { CodePipelineClient, StartPipelineExecutionCommand } = require("@aws-sdk/client-codepipeline");

const region = "eu-west-1";

const clientCodePipeline = new CodePipelineClient({
  region: region
});

module.exports.lexHandlerV1 = async (event) => {
  console.log('##Request', event);
  const intentName = event.sessionState.intent.name;

  if (event.invocationSource === 'DialogCodeHook') {
    if (intentName === 'FallbackIntent') {
      const ei = elicitIntent(event.sessionAttributes, intentName, event.sessionState.intent.slots, 'Could not understand, please ask: I want to deploy a microfrontend')
      return ei;
    }

    const slots = event.sessionState.intent.slots;
    if (intentName === 'DeployMicrofrontend' ) {

      if (!slots.MicroFrontendName || !slots.Environment) {
        let slotToElicit = ''

        if (!slots.MicroFrontendName) {
          slotToElicit = 'MicroFrontendName';
        }

        if (!slots.Environment) {
          slotToElicit = 'Environment';
        }

        return elicitSlot(event.sessionAttributes, 'DeployMicrofrontend', event.sessionState.intent.slots, slotToElicit)
      }


      if (slots.MicroFrontendName && slots.Environment) {
        const confirmationState = event.sessionState.intent.confirmationState;

        if (confirmationState === 'None') {
          return confirmIntent(event.sessionAttributes, intentName, slots);
        }

        if (confirmationState === 'Denied') {
          return close(event, 'Failed', 'Ok bye')
        }

        if (confirmationState === 'Confirmed') {
          const params = {
            name: 'mfe-' + event.sessionState.inputTranscript
          };

          console.log('params', params)
          const command = new StartPipelineExecutionCommand(params);
          const result = await clientCodePipeline.send(command);

          console.log('Result', result);

          return close(event, 'Fulfilled', 'Will start building thanks for talking to me!')
        }
      }


    }



  }

  throw new Error('Should not get here')
};

const close = (event, fulfillmentState, message) => {
  return {
    'sessionState': {
      sessionAttributes: event.sessionAttributes,
      'dialogAction': {
        'type': 'Close'
      },
      'intent': event['sessionState']['intent'],
      state: fulfillmentState
    },
    'messages': [
      {
        contentType: 'PlainText',
        content: message
      }
    ],
    'sessionId': event['sessionId']
  }
}


const confirmIntent = (sessionAttributes, intentName, slots) => {
  return {
    sessionState: {
      sessionAttributes,
      dialogAction: {
        type: 'ConfirmIntent'
      },
      intent: {
        name: intentName,
        slots
      }
    }

  }
}

const elicitIntent = (sessionAttributes, intentName, slots, message) => {
  return {
    sessionState: {
      sessionAttributes,
      dialogAction: {
        type: 'ElicitIntent'
      },
      intent: {
        name: intentName,
        slots
      },
      state: 'InProgress'
    },
    messages: [
      {
        contentType: 'PlainText',
        content: message
      }
    ]

  }
}

const elicitSlot = (sessionAttributes, intentName, slots, slotToElicit) => {
  return {
    sessionState: {
      sessionAttributes,
      dialogAction: {
        type: 'ElicitSlot',
        slotToElicit
      },
      intent: {
        name: intentName,
        slots
      }
    }

  }
}

const buildValidationResult = (isValid, violatedSlot, messageContent) => {
  return {
    'isValid': isValid,
    'violatedSlot': violatedSlot,
    'message': {'contentType': 'PlainText', 'content': messageContent}
  }

}
