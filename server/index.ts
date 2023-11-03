import express from 'express';
import bodyParser from "body-parser";
import flexpaAccessToken from "./routes/flexpa_access_token.js";
import fhirRouter from "./routes/fhir.js";
import "dotenv/config";

const app = express();
const port = 9000;

const cors = require('cors');
app.use(cors());

const options = {
    origin: 'http://localhost:5173',
}

app.use(cors(options));
app.use(bodyParser.json());
app.use("/flexpa-access-token", flexpaAccessToken);
app.use("/fhir", fhirRouter);

app.listen(port, "0.0.0.0", () => {
    console.log (`Listening on port ${port}`);
})
