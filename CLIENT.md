# Particle Christmas Tree Client

              \ /
            -->*<--
              /_\
             /_\_\
            /_/_/_\
           /_\_\_\_\
          /_/_/_/_/_\
         /_\_\_\_\_\_\
        /_/_/_/_/_/_/_\
       /_\_\_\_\_\_\_\_\
      /_/_/_/_/_/_/_/_/_\
     /_\_\_\_\_\_\_\_\_\_\
    /_/_/_/_/_/_/_/_/_/_/_\
             [___]


## Installation
1. Install Node.js [node v8.x and npm v5.x are required]
1. Clone this repository `$ git clone git@github.com:particle-iot/xmastree`
1. Install dependencies `$ npm install`
1. View available tasks `$ npm run`
1. Start your local development server `$ npm start`
1. Start Hacking!


## Development

The Particle Christmas Tree app is a single page application intended to run under any static file server. When developing, files are generated from source and served from the `./docs` directory (see [configuration](#configuration)) within the repo. To build the application in debug mode and run the local development server, simply enter:

`$ npm start`


## Configuration

The application can be tailored to its environment through environment variables. For complete details on what can be configured, refer to [`src/config.js`](src/config.js).

Here's the list of the most important variables and their values:

<!-- config-docs-start -->
| Environment Variable | Description | Default |
| -------------------: | ----------- | ------- |
| PATHS_PUBLIC | public directory used to serve static files | `./docs` |
| PATHS_CLIENT_SRC | location of client application files | `./src/client` |
| URLS_REPO | url to the github repo hosting the source code for this app | `https://github.com/particle-iot/xmastree` |
| URLS_APP | url to this website | `https://particle-iot.github.io/xmastree` |
| CLIENT_ID | the particle client id for this app (primarily for oauth) | `xmastree-prod-1784` |
| PARTICLE_API_URL | root url for the particle api | `https://api.particle.io` |
<!-- config-docs-end -->


## Registering a Client

If you want to host your own copy of the Particle Christmas Tree app, you will first need to register a client:

1. [create a particle user account](https://login.particle.io/)
2. [generate an access token](https://docs.particle.io/reference/api/#generate-an-access-token)
3. [create an oauth client](https://docs.particle.io/reference/api/#create-a-client)
	* `type` should be `web`
	* `redirect_uri` should be your url e.g. `https://mysite.com/` [[note](https://stackoverflow.com/a/18698307/579167)]
4. update the `CLIENT_ID` setting within [config.js](./src/config.js) with your new client id


## Releasing Updates

see [RELEASE.md](./RELEASE.md)

