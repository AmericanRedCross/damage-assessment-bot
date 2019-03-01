# Application Behavior Guide

## Countries Supported
The bot currently has support of taking information for the following countries –
- Myanmar

## Languages Supported
The bot currently supports interaction in the following languages – 
- English
- Burmese (Unicode)
- Burmese (Zawgyi)

## Myanmar Summary Aggregation Methodology

The following describes how the Myanmar Diasaster Assessment Dashboard aggregates reports that are captured within the filter criteria:

The 'Number of X' fields (Number of people before disaster, etc.) are aggregated as the sum of the field across all reports. If a user submits a report without one of these values, it counts as 0.

The Sector and Sector Factor values (Severity, Access, etc.) are aggregated as the average across all reports. If a user submits a report without one of these values, it counts as 0.

The Rankings sections (Affected Groups, Priority Sectors, etc.) are ranked by giving each ranking a 'ranking score' and taking the sum for each value. The values with the highest score sum are ranked highest. Values with score sums equal to 0 are not displayed. The ranking score is calculated as follows:

| Rank #     | Calculation   | Ranking Score |
|:-----------|:--------------|:--------------|
| 1          | 1 - ( 0 / 3 ) | 1             |
| 2          | 1 - ( 1 / 3 ) | .6666         |
| 3          | 1 - ( 2 / 3 ) | .3333         |
| Not ranked | 1 - ( 3 / 3 ) | 0             |

## Facebook Integration
The integration of Facebook and the bot is very well documented over here by Microsoft - https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-facebook?view=azure-bot-service-4.0#connect-a-bot-to-facebook-messenger


Facebook has its own Review process for the bots which changes from time to time. For the latest process on publishing the bot, please follow the documentation over here - https://developers.facebook.com/docs/messenger-platform/app-review

The Chatbot has a specific usage of Facebook. American Red Cross is going to have a public page where the users can find the chatbot and interact with it. The chatbot over Facebook redirects the users to an endpoint which hosts the single page web application. The web app is just an entry point to both the Chatbot and the Dashboard.

The public Facebook page needs to be associated to a specific Facebook App Registration and should have only the required permissions.

As of now, American Red Cross needs to get this app reviewed and then published on Facebook.
