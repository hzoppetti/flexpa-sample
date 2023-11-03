import { detailProp, currencyOptions } from "./App";

interface DetailModalProps {
  eobDetail: detailProp;
  toggleModal: () => void;
}

const DetailModal = ({ eobDetail, toggleModal }: DetailModalProps) => {
  return (
    <div className="modalBackground">
      <div className="centered">
        <div className="modal">
          <div>
            <button className="closeButton" onClick={toggleModal}>
              X
            </button>
            <div className="modalContent">
              <div className="top-container">
                <div className="summary-container">
                  <div>
                    <h1>Explanation of Benefits</h1>
                    <h2>THIS IS NOT A BILL</h2>
                    <p>
                      Your health care professional may bill you directly for
                      any amount that you owe.
                    </p>
                  </div>
                  <div>
                    <div>
                      <h3>Amount Billed</h3>
                      <div className="summary-detail">
                        <div className="detail-amount">
                          {eobDetail.payAmount?.toLocaleString(
                            "en-US",
                            currencyOptions
                          )}
                        </div>
                        <div className="detail-description">
                          This was the amount that was billed for your visit
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h3>Patient Responsibility</h3>
                      <div className="summary-detail">
                        <div className="detail-amount">
                          {eobDetail.patientPay?.toLocaleString(
                            "en-US",
                            currencyOptions
                          )}
                        </div>
                        <div className="detail-description">
                          This is the amount you owe after what your plan paid,
                          and what your accounts paid. People usually owe
                          because they may have a deductible, have to pay a
                          percentage of the covered amount, or for care not
                          covered by their plan. Any amount you paid when you
                          received care may reduce the amount you owe.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="details-container">
                  <div>
                    <h3>Claim Date</h3>
                    <div>{eobDetail.claimDate}</div>
                  </div>
                  <div>
                    <h3>Claim ID/#</h3>
                    <div>{eobDetail.id}</div>
                  </div>
                  <div>
                    <div>
                      <h3>Provider</h3>
                      <div>{eobDetail.provider}</div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h3>Claim Status</h3>
                      <div>{eobDetail.status}</div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h3>Payment Status</h3>
                      <div>{eobDetail.payStatus}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="eob-details-container">
                <div>
                  <h2>Diagnoses included in this EOB</h2>
                  {eobDetail.diagnosis.length === 0 ? (
                    <p>None</p>
                  ) : (
                    <ul>
                      {eobDetail.diagnosis.map((diag, index) => {
                        return <li key={index}>{diag}</li>;
                      })}
                    </ul>
                  )}
                </div>
                <div>
                  <h2>Procedures included in this EOB</h2>
                  {eobDetail.procedures.length === 0 ? (
                    <p>None</p>
                  ) : (
                    <ul>
                      {eobDetail.procedures.map((proc, index) => {
                        return <li key={index}>{proc}</li>;
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
