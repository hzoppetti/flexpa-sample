# Flexpa Work Sample - Server

## Prerequisites

- Obtain a secret (and publishable for use in the client project) key for the Flexpa API by creating a [Flexpa Portal account](https://portal.flexpa.com/). For this example, you should create test mode keys, found under Step 2 of the dashboard.
- Node 18 or above installed on your machine
- Rename the `.env.template` to `.env` and update the value for `FLEXPA_API_SECRET_KEY` with the secret key value you obtained above.

## Assumptions

- The server project is running on port 9000
- This client project when launched runs on port 5173, if this port is different on your local machine, you'll want to update the cors options in the server project to look for the specific port used on your machine.

## Instructions

In a different terminal (or tab) that is running your client project, and in the server directory root:

I used node 18, this is when fetch became part of Node.js

`nvm use 18`

Update your node modules.

`npm i`

Build the project.

`npm run build`

Run the project.

`npm run dev`
