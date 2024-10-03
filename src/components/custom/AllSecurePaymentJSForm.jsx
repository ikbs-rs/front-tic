import React, {useEffect, useState} from 'react';
import {init, interceptSubmit} from "./AllSecurePaymentUtil";
import axios from 'axios';
import env from "../../configs/env"
import Token from '../../utilities/Token';

function AllSecurePaymentJSForm({transactionId}) {
    const [payment, setPayment] = useState(undefined);
    const [initSuccess, setInitSuccess] = useState(false);

    console.log("payment ", payment)

  useEffect(() => {
    if (initSuccess === false) {
      console.log("--- payment init()---")
      setInitSuccess(true);
      setPayment(init());
    }
  }, []);

  const sendDebitTransaction = async (data) => {
    try {
        // if (newObj.date.trim() === '' || newObj.npar.trim() === '' || newObj.pib === null) {
        //   throw new Error(
        //     "Items must be filled!"
        //   );
        // }
        // const url = `${env.BZR_BACK_URL}/bzr/act?sl=${selectedLanguage}`;
        const url = `${env.TIC_BACK_URL}/tic/allsecure/sendTransaction`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': tokenLocal.token
        };
        const jsonObj = JSON.stringify(data)
        const response = await axios.post(url, jsonObj, { headers });
        console.log("***response.data***********"  , response.data, "****************")
        console.log("***response.data.redirectUrl***********"  , response.data.data.redirectUrl, "****************")


        // window.location.href = response.data.data.redirectUrl;
        // return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
  };

  const onSubmit = (e) => {
    console.log("transactionId ", transactionId)

    e.preventDefault();
    interceptSubmit(payment, transactionId, sendDebitTransaction);
  }

  return (
    <div className="App">
      <div>
        Checkout details:
        ...
      </div>
      <div>
        Please enter your card details:
      </div>
      <form id="payment_form" onSubmit={onSubmit}>
        <input type="hidden" name="transaction_token" id="transaction_token"/>
        <div>
          <label htmlFor="card_holder">Card holder</label>
          <input type="text" id="card_holder" name="card_holder"/>
        </div>
        <div>
          <label htmlFor="number_div">Card number</label>
          <div id="number_div" style={{"height": "35px", "width": "200px"}}></div>
        </div>
        <div>
          <label htmlFor="cvv_div">CVV</label>
          <div id="cvv_div" style={{"height": "35px", "width": "200px"}}></div>
        </div>
        <div>
          <label htmlFor="exp_month">Expiration Month</label>
          <input type="text" id="exp_month" name="exp_month"/>
        </div>
        <div>
          <label htmlFor="exp_year">Expiration Year</label>
          <input type="text" id="exp_year" name="exp_year"/>
        </div>
        <div>
          <input type="submit" value="Submit"/>
        </div>
      </form>
    </div>
  );
}

export default AllSecurePaymentJSForm;