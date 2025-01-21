Ovo mi je slanje komplet mail-a sa attachmentom

 let emailContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px auto;">
      <tr>
        <td style="background-color: #4CAF50; padding: 20px; color: #fff; text-align: center; font-size: 24px;">
          <strong>Hvala vam na kupovini!</strong>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; text-align: center;">
          <img src="${imageSrc}" alt="Ticketline Banner" style="width: 100%; max-width: 560px; border-radius: 5px;">
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <h2 style="color: #333;">Poštovani/a, ${user.text}!</h2>
          <p style="font-size: 16px;">Zahvaljujemo se na vašoj kupovini putem Ticketline-a. Vaša transakcija je uspešno završena, a vaše ulaznice su spremne!</p>
          
          <h3 style="color: #333;">Detalji transakcije:</h3>
          <p><strong>Broj narudžbine:</strong> ${transaction.id}</p>
          <p><strong>Ukupan iznos:</strong>  ${payment.amount || 'N/A'} RSD</p>
          <p><strong>Način plaćanja:</strong> Kartica (Kod: ${payment.id})</p>
          <p><strong>Datum transakcije:</strong> ${formatirajDatum(transaction.updated_at)}</p>

          <h3 style="color: #333;">Ulaznice su u prilogu.</h3>
          <p>Kliknite na linkove u prilogu kako bi preuzeli ulaznice.</p>

          <h3 style="color: #333;">Informacije o događaju:</h3>
          <p><strong>Sezonske ulaznice partizan</p>

          <h3 style="color: #333;">Detalji sedišta:</h3>
          <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr>
                <th>Sedište</th>
                <th>Red</th>
                <th>Sektor</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) =>
                    `<tr>
                      <td>${item.seat}</td>
                      <td>${item.row}</td>
                      <td>${item.nart} RSD</td>
                    </tr>`
                )
                .join('')}
            </tbody>
          </table>

          <p style="margin-top: 20px; font-size: 14px;">Za sva pitanja, obratite se na <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a> ili pozovite naš korisnički centar na 011-20-30-570.</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f2f2f2; padding: 20px; text-align: center; color: #888; font-size: 12px;">
          <p><strong>TICKETLINE doo</strong><br>
            Društvo za pružanje usluga ticketinga i prodaju ulaznica Ticketline doo Beograd<br>
            PIB: 103907543 | Matični broj: 20040505 | Šifra delatnosti: 4791</p>
          <p>Telefon: 011-20-30-570 | E-mail: <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a> | Web: <a href="https://www.ticketline.rs" style="color: #4CAF50; text-decoration: none;">www.ticketline.rs</a></p>
          <p><strong>Ticketline Shop - Novi Beograd</strong><br>
            Prizemlje TC Novi Mercator ul. Bul. Umetnosti br.4 (lokal pored naplate parkinga) | <a href="https://maps.app.goo.gl/39vgFrF8xcgdK9Q49" style="color: #4CAF50; text-decoration: none;">Google Maps</a><br>
            Radno vreme: ponedeljak - subota 10:00 - 18:00h, nedelja - neradni dan
          </p>
        </td>
      </tr>
    </table>
  </div>
`;


  let transporter = nodemailer.createTransport({
    host: 'mail.ticketline.rs',
    port: 465,
    secure: true,
    auth: {
      user: 'test@ticketline.rs',
      pass: 'Hun_3030'
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true
  });

  const mailOptions = {
    from: "Ticketline <no-reply@ticketline.com>",
    to: user.email,
    subject: "Potvrda o kupovini ulaznica",
    html: emailContent,
    attachments: [
      {
        filename: "karta.html",
        content: htmlContent,
      },
    ],
  };

    await transporter.sendMail(mailOptions);
    console.log('POSLE transporter:');
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});
