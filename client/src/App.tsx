import React from "react";

import { FlexpaConfig, LinkExchangeResponse } from "./flexpa_types";
import { Bundle } from "fhir/r4";
import EOB from "./EOB.tsx";

import "./App.css";
import DetailModal from "./DetailModal.tsx";

declare const FlexpaLink: {
  create: (config: FlexpaConfig) => Record<string, unknown>;
  open: () => Record<string, unknown>;
};

/**
 * Using this to format currency to USD
 * could use for other localities but for this sample only
 * USD is supported
 */
export const currencyOptions = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
};

export interface detailProp {
  id: string | undefined;
  claimDate: string;
  provider: string | undefined;
  status: string;
  payAmount: number | undefined;
  patientPay: number | undefined;
  payStatus: string | false | undefined;
  diagnosis: string[];
  procedures: string[];
}

function App() {
  const [aToken, setAToken] = React.useState("");
  const [eob, setEob] = React.useState({} as Bundle);
  const [eobDetails, setEobDetails] = React.useState<detailProp>({
    id: "",
    claimDate: "",
    provider: "",
    status: "",
    payAmount: 0,
    patientPay: 0,
    payStatus: "",
    diagnosis: [],
    procedures: [],
  });
  const [modalOpen, setModalOpen] = React.useState(false);
  const [listLoaded, setListLoaded] = React.useState(false);

  initializePage();

  function openEobDetail(detail: detailProp) {
    setEobDetails(detail);
    setModalOpen(true);
  }

  function toggleModal() {
    setModalOpen((prevModalOpen) => !prevModalOpen);
  }

  function initializePage() {
    if (!import.meta.env.VITE_FLEXPA_PUBLISHABLE_KEY) {
      console.error(
        "No publishable key found. Set VITE_FLEXPA_PUBLISHABLE_KEY in .env"
      );
    }

    FlexpaLink.create({
      publishableKey: import.meta.env.VITE_FLEXPA_PUBLISHABLE_KEY,
      onSuccess: async (publicToken: string) => {
        /*  Make a request to the `POST /flexpa-access-token` endpoint that we wrote in `server`.
            include the `publicToken` in the body. */
        let resp;
        try {
          resp = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/flexpa-access-token`,
            {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ publicToken }),
            }
          );
        } catch (err) {
          console.log("err", err);
        }

        if (!resp) {
          return;
        }

        // parse the response
        const { accessToken } = (await resp.json()) as LinkExchangeResponse;

        /**
         * Sets the success and loading message
         */
        setAToken(accessToken);

        // use the access token to get the eob
        let fhirEobResp;
        let fhirEobBody: Bundle;
        try {
          fhirEobResp = await fetch(
            `${
              import.meta.env.VITE_SERVER_URL
            }/fhir/ExplanationOfBenefit?patient=$PATIENT_ID`,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${accessToken}`,
                "X-Flexpa-Raw": "0",
              },
            }
          );
          fhirEobBody = (await fhirEobResp.json()) as Bundle;
        } catch (err) {
          console.log("EOB error: ", err);
          return;
        }
        if (!fhirEobResp.ok) {
          console.error(`Fetch failed with status: ${fhirEobResp.status}`);
          return;
        }

        setEob(fhirEobBody);

        /**
         * Hides the loading message
         * could/should probably do a fancy loading animation
         */
        setListLoaded(true);
      },
    });
  }

  return (
    <div>
      {modalOpen && (
        <DetailModal eobDetail={eobDetails} toggleModal={toggleModal} />
      )}
      {aToken && !listLoaded && (
        <p>Success, your health plan has been linked! EOB list loading...</p>
      )}

      <div>
        <h1>Flexpa Work Sample - Heather Zoppetti</h1>
        <h2>
          Welcome, click the button below connect to a provider and log in with
          a sample user.
        </h2>
        <h2>Instructions:</h2>
        <ol>
          <li>
            For sample users, see the{" "}
            <a href="https://www.flexpa.com/docs/getting-started/test-mode#test-mode-logins">
              Flexpa documentation on test mode logins.
            </a>
          </li>
          <li>
            For the best experience, I recommend using <strong>Humana</strong>{" "}
            and the user <strong>HUser00001</strong>
          </li>
          <li>
            After you're redirected to your provider to login, this page will
            load a sample table with a list of some Explanation of Benefits.
          </li>
          <li>
            Click on any row of the table to view more details for any of the
            EOBs listed.
          </li>
          <li>To chose another sample user, click the connect button again.</li>
        </ol>
      </div>
      <div>
        <button
          onClick={() => {
            FlexpaLink.open();
          }}
        >
          Click to connect
        </button>
      </div>
      <div>
        {listLoaded && <EOB eobJson={eob} openDetail={openEobDetail} />}
      </div>
    </div>
  );
}

export default App;
