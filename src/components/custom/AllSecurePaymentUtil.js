import env from "../../configs/env";

const publicIntegrationKey = "nVpMpbiPMC3BoDizvN6s";
 

export const init = () => {
  console.log("--- init ---")
  let payment = null //new PaymentJs();
  payment.init(publicIntegrationKey, 'number_div', 'cvv_div', function (payment) {
    payment.setNumberStyle({
      'border': '1px solid black',
      'width': '150px'
    });
    payment.setCvvStyle({});
    payment.numberOn('input', function (data) {
      // alert('A number was entered');
    })
  });

  return payment;
}

export function interceptSubmit(payment, transactionId, submitCallback) {
  const data = {
    card_holder: document.getElementById('card_holder').value,
    month: document.getElementById('exp_month').value,
    year: document.getElementById('exp_year').value
  };

  console.log("data ", data)
  payment.tokenize(
    data, // additional data, MUST include card_holder (or first_name & last_name), month and year
    function (token, cardData) { // success callback function
      document.getElementById('transaction_token').value = token; // store the transaction token
      submitCallback({
        "merchantTransactionId": transactionId,
        "transactionToken": token,
        // "merchantMetaData": "merchantRelevantData",
        "amount": "9.99",
        "currency": "RSD", 
        "successUrl":`${env.DOMEN}/tic/successUrl.html`,
        // "cancelUrl": "https://example.com/cancel",
        "errorUrl":`${env.DOMEN}/tic/errorUrl.html`,
        "callbackUrl": `${env.DOMEN}/btic/postback/allsecure`,
        // "description": "Example Product",
        // "customer": {
        //   "identification": "c0001",
        //   "firstName": "John",
        //   "lastName": "Doe",
        //   "birthDate": "1990-10-10",
        //   "gender": "M",
        //   "billingAddress1": "Maple Street 1",
        //   "billingAddress2": "Syrup Street 2",
        //   "billingCity": "Victoria",
        //   "billingPostcode": "V8W",
        //   "billingState": "British Columbia",
        //   "billingCountry": "CA",
        //   "billingPhone": "1234567890",
        //   "shippingFirstName": "John",
        //   "shippingLastName": "Doe",
        //   "shippingCompany": "Big Company Inc.",
        //   "shippingAddress1": "Yellow alley 3",
        //   "shippingAddress2": "Yellow alley 4",
        //   "shippingCity": "Victoria",
        //   "shippingPostcode": "V8W",
        //   "shippingState": "British Columbia",
        //   "shippingCountry": "CA",
        //   "shippingPhone": "1234567890",
        //   "company": "John's Maple Syrup",
        //   "email": "john@example.com",
        //   "emailVerified": false,
        //   "ipAddress": "127.0.0.1",
        //   "nationalId": "1234",
        //   "extraData": {
        //     "someCustomerDataKey": "value",
        //     "anotherKey": "anotherValue"
        //   }
        // },
        // "extraData": {
        //   "someKey": "someValue",
        //   "otherKey": "otherValue"
        // },
        // "threeDSecureData": {
        //   "3dsecure": "MANDATORY"
        // },
        // "language": "en"
      }); // submit the form
    },
    function (errors) { // error callback function
      console.log("errors ", errors);
      alert('Errors occurred');
      // render error information here
    }
  );
}