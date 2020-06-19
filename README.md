# Human API Connect Client
[![NPM](https://nodei.co/npm/humanapi-connect-client.png)](https://nodei.co/npm/humanapi-connect-client/)

## Table of contents

- [Description](#description)
- [Installation](#installation)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Upgrade from 1.x.x](#upgrade-from-1xx)

## Looking for `1.x` documentation?

The documentation below is for `humanapi-connect-client@2`. We have recently released a new Connect integration client version that replaces the old 1.x.x version that has been deprecated.

It is recommended that you use this new client version which is backwards compatible to make the transition easier.

[Click here](https://github.com/humanapi/connect-client/tree/4e5ab9ff1c41946f5320fbe3e457ce0e4b117caf) for `humanapi-connect-client@1.x` documentation.

---

## Description

Connect is the authentication widget for your application to allow users to share their health data. After a user has successfully granted you access to their health data using Connect, you'll be able to query their disparate data directly from Human API. 

Please refer to the [connect guide](http://myhealthdata.co/connect-guide) for full instructions on how to use the Connect client.

## Installation

This module can be used by loading the script from our CDN or by installing the npm module.

### CDN
To use the library via our CDN you can include the following script source:

```html
<script src="https://cdn.humanapi.co/humanapi-connect-client@latest.js">
```

### NPM module
To install the npm module and use it with e.g. React:

```sh
npm install --save humanapi-connect-client
```

## Usage

To use this library regardless of the method used, you first need to acquire a session token and set it as the data-attribute `data-hapi-token` of an element that supports the `onclick` event (e.g. a button). Then, you need to add the class `hapi__token-container` to the parent of the element that has the token value, e.g.: 

```html
<div class="hapi__token-container">
    <button data-hapi-token="<your session token>">Open Connect</button>
</div>
```

**Note:** Make sure that the element containing the class `hapi__token-container` is rendered on page load.

The library will then automatically configure all elements with the `data-hapi-token` attribute under that parent, to allow them to open the Connect window.

### Lifecycle hooks

`humanapi-connect-client` can be configured to respond to the following lifecycle hooks:
 
 - `connect`: This event will be fired after a source has been successfully connected
 - `disconnect`: This event will be fired after a source has been disconnected
 - `close`: This event will be fired after the Connect window is closed, regardless of whether sources were connected or not
 - `error`: This event fires in case theres an error with the library e.g. a token container element is not found
 
 To add a lifecycle hook to a particular event you have to use the `on(eventName, eventListener)` method, e.g.:
 
 ```javascript
HumanConnect.on("close", (response) => {console.log("close", response)});
HumanConnect.on("connect", (response) => {console.log("connect", response)});
HumanConnect.on("disconnect", (response) => {console.log("disconnect", response)});
HumanConnect.on("error", (response) => {console.error("error", response)});
```
 
 Any function listening for lifecycle events defined by Connect will receive a payload with the following schema:
  
  ```javascript
   {
       sessionResults: {
           // List of sources the user connected during this session
           connectedSources: [
               {
                   name: "Starfleet Pharmacy",
                   id: "5b1daf3f079c652eaf41fd23"
               }
           ],
           // List of sources the user disconnected during this session
           disconnectedSources: [],
           // List of sources the user requested during this session
           requestedSources: [
               {
                   address: "742 Evergreen Terrace, OH",
                   healthSystem: "N/A",
                   location: {
                       latitude: 41.3289,
                       longitude: -105.6928
                   },
                   physician: "Dr. John Smith",
                   website: "drjohnsmith.example.com"
               }
           ]
       },
       // List of sources the user currently has connected with your app
       currentConnections: [
           {
               name: "Starfleet Pharmacy",
               id: "5b1daf3f079c652eaf41fd23"
           }
       ],
       // List of sources the user has requested
       requestedProviders: [
               {
                   address: "742 Evergreen Terrace, OH",
                   healthSystem: "N/A",
                   location: {
                       latitude: 41.3289,
                       longitude: -105.6928
                   },
                   physician: "Dr. John Smith",
                   website: "drjohnsmith.example.com"
               }
       ]
   }
   ```

## Upgrade from 1.x.x

### CDN
- If you are using the script via the CDN and the source location is `src=https://cdn.humanapi.co/humanapi-connect-client@latest.js` you will be upgraded automatically. The new version is backwards compatible so there is no other change needed for the time being.

- If you are using a specific version of the library, e.g. `src=https://cdn.humanapi.co/humanapi-connect-client@1.2.4.js` you can just use `humanapi-connect-client@latest.js` or specify a 2.x.x version, e.g. `humanapi-connect-client@2.0.4.js`

### npm
- Install the latest package with `npm install humanapi-connect-client`
