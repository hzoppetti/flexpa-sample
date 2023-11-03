import {
  Bundle,
  ExplanationOfBenefit,
  ExplanationOfBenefitTotal,
} from "fhir/r4";

import { detailProp, currencyOptions } from "./App";

interface EobProps {
  eobJson: Bundle;
  openDetail: (arg0: detailProp) => void;
}

const EOB = ({ eobJson, openDetail }: EobProps) => {
  if (!eobJson.entry) {
    return <div>No EOB result</div>;
  }
  const count = eobJson.entry.length;
  const rows = [];
  for (let i = 0; i < count; ++i) {
    const resource: ExplanationOfBenefit = eobJson.entry[i]
      .resource as ExplanationOfBenefit;
    let totalPayment;
    let patientPayment;

    /**
     * from fhir ExplanationOfBenefit.total:
     * Categorized monetary totals for the adjudication.
     * Totals for amounts submitted, co-pays, benefits payable etc.
     */
    const totals = resource.total;
    const totalCount: number =
      typeof totals === "undefined" || totals.length === 0 ? 0 : totals.length;

    for (let j = 0; j < totalCount; ++j) {
      if (typeof totals !== "undefined") {
        const tot: ExplanationOfBenefitTotal = totals[
          j
        ] as ExplanationOfBenefitTotal;
        const cat = tot.category;
        const coding = cat.coding;

        /**
         * Note: These codes are specific to Humana
         * Different codes are used at other payers
         * I chose these as examples in this sample, but others would be used
         * for a production environment
         */
        if (cat && typeof coding !== "undefined") {
          if (coding[0].code === "paymentamount") {
            totalPayment = tot.amount.value;
          }
          if (coding[0].code === "patientpayamount") {
            patientPayment = tot.amount.value;
          }
        }
      }
    }

    /**
     * from fhir ExplanationOfBenefit.payment:
     * Payment details for the adjudication of the claim.
     * Needed to convey references to the financial instrument
     * that has been used if payment has been made.
     */
    const totalPaymentCodings = resource.payment?.type?.coding;
    const totalCodings: number =
      typeof totalPaymentCodings === "undefined" ||
      totalPaymentCodings.length === 0
        ? 0
        : totalPaymentCodings.length;

    /**
     * Note: I made the decision to take only the first of the array to simplify the assignment
     * This would likely not be the case in a production environment
     */
    const payStatus =
      typeof totalPaymentCodings !== "undefined" &&
      totalCodings > 0 &&
      totalPaymentCodings[0].display;

    /**
     * from fhir ExplanationOfBenefit.diagnosis:
     * Information about diagnoses relevant to the claim items.
     * Required for the adjudication by provided context for the services and product listed.
     */
    const diagnosisArray: string[] = [];
    const diagnosis = resource.diagnosis;
    const totalDiagnosis: number =
      typeof diagnosis === "undefined" || diagnosis.length === 0
        ? 0
        : diagnosis.length;

    for (let k = 0; k < totalDiagnosis; ++k) {
      if (typeof diagnosis !== "undefined") {
        const coding = diagnosis[k].diagnosisCodeableConcept?.coding;
        const totalCodings: number =
          typeof coding === "undefined" || coding.length === 0
            ? 0
            : coding.length;
        /**
         * For simplicity I'm just adding the diagnoses as a list of strings
         * For some payers other than Humana, I noticed that they don't even use
         * the display field, only the code field. This was a problem, and I didn't
         * bother to handle it other than to check for the undefined field and not
         * add the string to the array
         */
        for (let i = 0; i < totalCodings; ++i) {
          if (typeof coding !== "undefined") {
            if (coding[i].display) {
              diagnosisArray.push(coding[i].display as string);
            }
          }
        }
      }
    }

    /**
     * from fhir ExplanationOfBenefit.procedure:
     * Procedures performed on the patient relevant to the billing items with the claim.
     * The specific clinical invention are sometimes required to be provided to
     * justify billing a greater than customary amount for a service.
     */
    const procedureArray: string[] = [];
    const procedures = resource.procedure;
    const totalProcedures: number =
      typeof procedures === "undefined" || procedures.length === 0
        ? 0
        : procedures.length;

    /**
     * For simplicity I'm just adding the procedures as a list of strings
     */
    for (let m = 0; m < totalProcedures; ++m) {
      if (typeof procedures !== "undefined") {
        if (procedures[m].procedureReference?.display) {
          procedureArray.push(
            procedures[m].procedureReference?.display as string
          );
        }
      }
    }

    // create the object to pass to the detail modal
    const detail: detailProp = {
      id: resource.id,
      claimDate: resource.created,
      provider: resource.provider.display,
      status: resource.status,
      payAmount: totalPayment,
      patientPay: patientPayment,
      payStatus: payStatus,
      diagnosis: diagnosisArray,
      procedures: procedureArray,
    };

    // create the row for the table
    rows.push(
      <tr key={resource.id} onClick={() => openDetail(detail)}>
        <td>{resource.created}</td>
        <td>{resource.provider.display}</td>
        <td>{resource.status}</td>
        <td>{totalPayment?.toLocaleString("en-US", currencyOptions)}</td>
        <td>{patientPayment?.toLocaleString("en-US", currencyOptions)}</td>
        <td>{payStatus}</td>
      </tr>
    );
  }
  return (
    <table>
      <caption>Click on any row for more details</caption>
      <thead>
        <tr>
          <th>Claim Date</th>
          <th>Provider</th>
          <th>Claim Status</th>
          <th>Payment Amount</th>
          <th>Patient Responsibility</th>
          <th>Claim Payment Status</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default EOB;
