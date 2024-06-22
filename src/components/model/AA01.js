import React, { useState } from 'react';
import { FormControlLabel, Checkbox, Grid, Button, TextField, Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import styled from '@emotion/styled';

const StyledPodaciKupcaStep = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledFormField = styled.div`
  margin: 10px 0;
`;

const PodaciKupcaStep = ({ onNext, showNextButton, eventAttributes, eventData, orderDetails, activeIndex, onPrevious,
  stepData,
  setStepData,
  formData,
  setFormData,
  file,
  setFile,
  fileName,
  setFileName,
  isReservation,
  setIsReservation }) => {

  // State to track which sections are open
  const [openSections, setOpenSections] = useState(orderDetails.map(() => true));

  const toggleSection = (index) => {
    const newOpenSections = [...openSections];
    newOpenSections[index] = !newOpenSections[index];
    setOpenSections(newOpenSections);
  };

  const items = orderDetails || [];

  const [discounts, setDiscounts] = useState(items.map(() => ''));
  // const [hasSeasonTicket, setHasSeasonTicket] = useState(items.map(() => true));

  const handleFieldChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setStepData(prevData => ({
      ...prevData,
      formData: formData,
      discounts: discounts,
    }));

    onNext();
  };

  let povezaniDogadjaji = eventAttributes.filter(attribute => attribute.att_code === "00.00.");
  console.log("PodaciKupcaStep povezaniDogadjaji:", povezaniDogadjaji); // Debug

  
  const goNext = () => {
    onNext();
  };

  console.log("PodaciKupcaStep formData:", formData); // Debug
  console.log("PodaciKupcaStep discounts:", discounts); // Debug
  console.log("PodaciKupcaStep orderDetails:", orderDetails); // Debug
  console.log("PodaciKupcaStep activeIndex:", activeIndex); // Debug
  console.log("PodaciKupcaStep showNextButton:", showNextButton); // Debug
  console.log("PodaciKupcaStep eventAttributes:", eventAttributes); // Debug
  console.log("PodaciKupcaStep eventData:", eventData); // Debug
  console.log("PodaciKupcaStep stepData:", stepData); // Debug


  
  const handleFileUpload = (index, file) => {
    setFormData(prevState => prevState.map((item, i) => i === index ? {
      ...item,
      file: file,
      fileName: file.name
    } : item));
  };

  
  const handleCardNumberChange = (index, value) => {
    setFormData(prevState => prevState.map((item, i) => i === index ? {
      ...item,
      cardNumber: value
    } : item));
  };

  const handleCheckboxChange = (index, checked) => {
    setFormData(prevState => prevState.map((item, i) => i === index ? {
      ...item,
      noCardNumber: checked
    } : item));
  };

  
  return (
    <Box sx={{ paddingTop: 2 }} className="container-margin">
      <form onSubmit={handleSubmit}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index}>


              <Box key={`b1-${index}`} sx={{ paddingTop: 2 }}>
                <Box key={`b2-${index}`} sx={{ display: "flex", justifyContent: "space-between", borderBottom: '1px solid #ddd', padding: 1 }}>
                  <Typography variant="h6">Dogadjaj: {item.event_text}</Typography>
                </Box>
                <Box key={`b3-${index}`} sx={{ display: "flex", justifyContent: "space-between", borderBottom: '1px solid #ddd', padding: 1 }}>
                  <Typography variant="body1">{`${item.quantity ? item.quantity : 1} x `}</Typography>
                  <Typography variant="body1">Kategorija: {item.art_text}, Red: {item.rownum}, Sedište: {item.seatnum}</Typography>
                  <Typography variant="body1">{`${item.price} rsd`}</Typography>
                </Box>
                <StyledPodaciKupcaStep>
                  <h2 className="section-title">Unesite podatke osobe za kartu</h2>


                  {povezaniDogadjaji.length > 0 && povezaniDogadjaji[0].additionalData.map((data, index) => data.id && (
                    <div key={index}>
                      <p>{data.text}</p>
                      <TextField
                        label="Broj karte"
                        name={`cardNumber${index}`}
                        value={formData[index]?.cardNumber || ''}
                        onChange={e => handleCardNumberChange(index, e.target.value)}
                        style={{ marginRight: '1em' }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={`noCardNumber${index}`}
                            checked={formData[index]?.noCardNumber || false}
                            onChange={e => handleCheckboxChange(index, e.target.checked)}
                          />
                        }
                        label="Prilog: "
                      />
                      {formData[index]?.noCardNumber && (
                        <Button variant="contained" component="label">
                          Priloži dokument
                          <input type="file" hidden onChange={e => handleFileUpload(index, e.target.files[0])} />
                        </Button>
                      )}
                      {formData[index]?.fileName && (
                        <p>File name: {formData[index].fileName}</p>
                      )}
                    </div>
                  ))}

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <StyledFormField>
                        <TextField
                          label="Ime"
                          value={formData[index].firstName}
                          onChange={(e) => handleFieldChange(index, 'firstName', e.target.value)}
                          fullWidth
                        />

                      </StyledFormField>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledFormField>
                        <TextField
                          label="Prezime"
                          value={formData[index].lastName}
                          onChange={(e) => handleFieldChange(index, 'lastName', e.target.value)}

                          fullWidth
                        />

                      </StyledFormField>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <StyledFormField>
                        <TextField
                          label="JMBG"
                          value={formData[index].jmbg}
                          onChange={(e) => handleFieldChange(index, 'jmbg', e.target.value)}
                          fullWidth
                        />
                      </StyledFormField>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledFormField>
                        <TextField
                          label="PIB"
                          value={formData[index].pib}
                          onChange={(e) => handleFieldChange(index, 'pib', e.target.value)}
                          fullWidth
                        />
                      </StyledFormField>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StyledFormField>
                        <TextField
                          label="Adresa"
                          value={formData[index].address}
                          onChange={(e) => handleFieldChange(index, 'address', e.target.value)}
                          fullWidth
                        />
                      </StyledFormField>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <StyledFormField>
                        <TextField
                          label="PTT broj"
                          value={formData[index].ptt}
                          onChange={(e) => handleFieldChange(index, 'ptt', e.target.value)}
                          fullWidth
                        />
                      </StyledFormField>
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFormField>
                        <TextField
                          label="Grad"
                          value={formData[index].city}
                          onChange={(e) => handleFieldChange(index, 'city', e.target.value)}
                          fullWidth
                        />
                      </StyledFormField>
                    </Grid>
                    <Grid item xs={5}>
                      <StyledFormField>
                        <TextField
                          label="Država"
                          value={formData[index].country}
                          onChange={(e) => handleFieldChange(index, 'country', e.target.value)}
                          fullWidth
                        />
                      </StyledFormField>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <StyledFormField>
                        <TextField
                          label="Broj telefona"
                          value={formData[index].phone}
                          onChange={(e) => handleFieldChange(index, 'phone', e.target.value)}
                          fullWidth
                        />
                      </StyledFormField>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledFormField>
                        <TextField
                          label="Email"
                          type="email"
                          value={formData[index].email}
                          onChange={(e) => handleFieldChange(index, 'email', e.target.value)}
                          fullWidth
                        />
                      </StyledFormField>
                    </Grid>
                  </Grid>

                </StyledPodaciKupcaStep>
              </Box>
            </div>
          ))
        ) : (
          <Typography variant="body2" style={{ color: '#777' }}>Nema karata u korpi.</Typography>
        )
        }

        <Grid container justifyContent="space-between" margin="10px 0">
          <Grid item>
            {activeIndex > 0 && (
              <Button id="backBtn" variant="contained" color="secondary" onClick={onPrevious}>
                Nazad
              </Button>
            )}
          </Grid>
          <Grid item>
            {showNextButton && (
              <Button id="nextBtn" variant="contained" color="primary" onClick={goNext}>
                Nastavi
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PodaciKupcaStep;