

const resumeProcess = async (transactionId, token) => {

    try {
        console.log("Transaction successful");
        const print = false;
        const email = 'zivkovic.marko@hotmail.com';
        // Ako je print false, i ovde stavljen mail, onda se fiskal i salje na taj mail preko terona

        const invoiceRequest = {
            invoiceType: 'Training', // OBAVEZNO !!!!! ZA OBUKU da ne fiskalizuje stvarno
            transactionType: 'Sale', //— PRODAJA, moze i profaktura, storniranje....
            payment: [
                {
                    amount: 12.00,
                    paymentType: 'WireTransfer'
                }

            ], //— DOKUMENT, ukupan iznos i nacin placanja (WireTrinsfer je kartica)
            items: [
                {
                    name: 'Neka karta za koncert aaa',
                    labels: ['Г'],
                    totalAmount: 10.00,
                    unitPrice: 5.00,
                    quantity: 2.000
                },
                {
                    name: 'Troskovi obrade',
                    labels: ['Ђ'],
                    totalAmount: 2.00,
                    unitPrice: 2.00,
                    quantity: 1.000
                }
            ], //— Stavke G je bez pdv, DJ je sa 20% pdv...
            cashier: 'Marko TEST',
            buyerId: '11:2505979710072' //— Identifikacija kupca 11:JMBG je fizicko lice ima i za PIB format
        };

        const payload = {
            print,
            email,
            invoiceRequest
        };

        restApi.post(`${process.env.REACT_APP_REST_BACK_URL}/fiskalni-racun-esir`, payload);
        //— OVO JE BSAL NA SERVERU 



    } catch (error) {

        console.error("Error resuming process:", error);

    }

};

