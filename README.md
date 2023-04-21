# VRChat Invite Bot

The VRChat Invite Bot is a simple Node.js application that helps you automate the process of accepting friend requests and sending invites to specific world instances. It uses the VRChat API to continuously monitor and process friend requests and invite notifications. The bot is designed to run in a headless environment, making it suitable for deployment on a server or in a Docker container.

## Features

- Automatically accepts friend requests
- Sends invites to a specific world instance upon receiving an invite request
- Configurable logging with console and file output
- Easy-to-use environment variables for configuration

## Prerequisites

- Node.js (v14 or later)
- A VRChat account with API access

## Setup

1. Run `npm install` to install the required dependencies.
2. Create a `.env` file in the root of the project directory and add the necessary environment variables (see the `.env` file configuration section below).
3. Run `node index.js` to start the bot.

## `.env` File Configuration

The bot uses environment variables for configuration, which are stored in a `.env` file. Create a `.env` file in the root directory of the project and add the following variables:

```ini
USERNAME=myusername
PASSWORD=mypassword
WORLD_ID=world_id
INSTANCE_ID=instance_id
LOG_LEVEL=error
```

Replace `myusername`, `mypassword`, `world_id`, and `instance_id` with your VRChat account credentials and the desired world and instance IDs. The `LOG_LEVEL` variable sets the logging level for the log file. Available log levels are `info`, `warn`, and `error`.

- `info`: Logs all messages (info, warning, and error)
- `warn`: Logs warning and error messages
- `error`: Logs only error messages

## How It Works

The bot logs into your VRChat account using the provided credentials and continuously checks for notifications every 10 seconds. When a friend request notification is received, the bot accepts the request. If an invite notification is received, the bot sends an invite to the user who sent the request, inviting them to the specified world instance.

## Logging

The bot uses `winston` for logging, providing console and file output. Console output always displays all message types, while the file output logging level can be configured using the `LOG_LEVEL` environment variable. Log messages include a timestamp, severity level, and the log message itself.

## Contributing

Feel free to open issues or submit pull requests if you find any bugs or want to improve the bot. Your contributions are always appreciated!
