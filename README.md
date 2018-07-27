# humanapi-connect-client

## Description

This purpose of this library is to spawn https://hapi-connect.humanapi.co within your application.

## Installation

This module is distributed via npm which is bundled with node and should be installed as one of your project's dependencies:

`npm i humanapi-connect-client`

This project currently has no dependencies.

## Simple Usage

```javascript
import * as ConnectClient from "humanapi-connect-client";

const options = { token: "this-is-your-session-token" };

ConnectClient.open(options);
```

## Full list of options

#### `options.token` - _required_

This is the session token that is used to validate your `hapi-connect` session.

#### `options.close(payload)` - _optional_

This is the function that will be executed when `hapi-connect` is closed. The payload passed to this function will have the following schema:

```javascript
{
    sessionResults: {
        // List of sources the user connected during this session
        connected: [
            {
                name: "Starfleet Pharmacy",
                id: "5b1daf3f079c652eaf41fd23"
            }
        ],
        // List of sources the user disconnected during this session
        disconnected: []
    },

    // List of sources the user currently has connected with your app
    connections: [
        {
            name: "Starfleet Pharmacy",
            id: "5b1daf3f079c652eaf41fd23"
        }
    ],

    // Code that will be used to obtain the user's data
    authCode: {
        code: "e76bqoer67qr6vetuhqwtrwfrfds6",
        expiresAt: 1532723922694,
        expiresIn: 3600
    }
};
```

#### `options.error(errorMessage)` - _optional_

This is the function that will be executed when `hapi-connect` is closed due to an error. An error message will be passed in as the only parameter.

## Full Usage

```javascript
import * as ConnectClient from "humanapi-connect-client";

const token = "this-is-your-session-token";

const close = ({ sessionResults, connections, authCode }) => {
    console.log(`You have a total of ${connections.length} connections`);
    const connectionsStr = connections.reduce((acc, connection, i) => {
        acc += connection.name;
        acc += i !== connections.length - 1 && ", ";
        return acc;
    }, "");
    console.log(`Your current connections are ${connectionsStr}`);
    console.log(
        `During this previous session, you connected ${
            sessionResults.connected.length
        } sources and disconnected ${
            sessionResults.disconnected.length
        } sources.`
    );
};

const error = errorMessage => {
    console.error(errorMessage);
};

const options = { token, close, error };

ConnectClient.open(options);
```
