# Application Behavior Guide

## Countries Supported
The bot currently has support of taking information for the following countries –
- Myanmar

## Languages Supported
The bot currently supports interaction in the following languages – 
- English
- Burmese (Unicode)
- Burmese (Zawgyi)

## Facebook Integration
The integration of Facebook and the bot is very well documented over here by Microsoft - https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-facebook?view=azure-bot-service-4.0#connect-a-bot-to-facebook-messenger


Facebook has its own Review process for the bots which changes from time to time. For the latest process on publishing the bot, please follow the documentation over here - https://developers.facebook.com/docs/messenger-platform/app-review

The Chatbot has a specific usage of Facebook. American Red Cross is going to have a public page where the users can find the chatbot and interact with it. The chatbot over Facebook redirects the users to an endpoint which hosts the single page web application. The web app is just an entry point to both the Chatbot and the Dashboard.

The public Facebook page needs to be associated to a specific Facebook App Registration and should have only the required permissions.

As of now, American Red Cross needs to get this app reviewed and then published on Facebook.
