# Flexpa Work Sample - Heather Zoppetti

This is the work sample created for Flexpa.

To run this, you need both the client and server projects running.

Note: when I run the client, it opens on port 5173. For CORS, I have the server looking specifically for `localhost:5173`. If this port is different for you, please change this in the `index.ts` file in the server project before running.

As stated below, you'll also need to create a [Flexpa Portal account](https://portal.flexpa.com/) to create some test mode API keys (see Prerequisites below).

Then, once you've got your applications running, you'll need to log into a [sample account](https://www.flexpa.com/docs/getting-started/test-mode#test-mode-logins). For the best experience, I recommend using the Humana account `HUser00001`.

## Prerequisites

- Obtain a secret (and publishable for use in the client project) key for the Flexpa API by creating a [Flexpa Portal account](https://portal.flexpa.com/). For this example, you should create test mode keys, found under Step 2 of the dashboard.
- Rename the `.env.template` in both the client and server projects to `.env`
- In the `server` project's `.env` file, update the value for `FLEXPA_API_SECRET_KEY` with the secret key value you obtained above.
- In the `client` project's `.env` file, update the value for `VITE_FLEXPA_PUBLISHABLE_KEY` with the publishable key value you obtained above.
- Node 18 or above installed on your machine

## Assumptions

- The server project is running on port 9000.
- This client project when launched runs on port 5173, if this port is different on your local machine, you'll want to update the cors options in the server project to look for the specific port used on your machine.

## Instructions

### Server
In the terminal, from the project root, change directory to the server root

`cd server`

I used node 18, this is when fetch became part of Node.js

`nvm use 18`

Update your node modules.

`npm i`

Build the project.

`npm run build`

Run the project.

`npm run dev`

### Client
In a different terminal or tab, from the project root, change directory to the client root

`cd client`

I used node 18, this is when fetch became part of Node.js

`nvm use 18`

Update your node modules.

`npm i`

Build the project.

`npm run build`

Run the project.

`npm run dev`
