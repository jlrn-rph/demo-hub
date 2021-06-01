import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useStyles, theme } from '../components/Style';
import Sidebar from '../components/Nav';
import Title from '../components/Title';
import Result from '../components/Result';
import { Button, ThemeProvider, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';  
import Paper from '@material-ui/core/Paper';
import ReactHTMLTableToExcel from '../components/ReactHTMLTableToExcel';
import * as tf from "@tensorflow/tfjs";

export default function Home() {
  const classNames = ['AnnualCrop', 'HerbaceousVegetation', 'Pasture', 'PermanentCrop'];
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);
  const [uniqueCouse, SetUniqueCourse] = useState(null); 
  const fileInputRef = useRef();
  const MAX_LENGTH = 10;
  let classes = useStyles();
  let image = [];
  let Output = [];
  let images = document.images; 

  //Load Model
  const loadModel = async () => {
    setIsModelLoading(true);
    try {
        const model = await tf.loadLayersModel("http://localhost:81/satellite/model.json");
        global.fetch = require('node-fetch');
        setModel(model);
        setIsModelLoading(false);
    } catch (error) {
        console.log(error);
        setIsModelLoading(false);
      }
  }

  //Upload Image
  const uploadImage = (e) => {
    setResults('');
    if (Array.from(e.target.files).length > MAX_LENGTH) {
        e.preventDefault();
        alert(`Cannot upload files more than ${MAX_LENGTH}`);
        return;
    } else {
      for (let i = 0; i < e.target.files.length; i++) {
        const url = URL.createObjectURL(e.target.files[i]);
        const filename = e.target.files[i].name;
        image.push([url,filename]);
      }
      setImageURL(image);
    }
  }

  //Detect Image
    const identify = async () => {
    for(var i = 0; i < images.length; i++){
        const results = await model.predict(tf.browser
        .fromPixels(images[i])
        .resizeNearestNeighbor([224, 224])
        .cast('float32').expandDims());
        //setResults(results);

        let name = images[i].attributes[0].textContent.split("\"\"");
        const labelPrediction = results.as1D().argMax().dataSync()[0]; //get class name
        Output.push([i+1,name,classNames[labelPrediction],results.dataSync()[0]]);
      }
    setResults(Output);
    SetUniqueCourse(results, results[2]);
  }

  const triggerUpload = () => {
    fileInputRef.current.click();
  }

  useEffect(() => {
    loadModel();
  }, []);

  if (isModelLoading) {
    return <h2>Model Loading...</h2>
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Sidebar />
      <div>
      <ThemeProvider theme={theme}>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
                {/* Title */}
                <Grid item xs={12}>
                <Paper className={classes.paper}>
                        <Title title = 'Satellite Classifer' />
                        <Title description = 'Upload satellite images and get satellite classification results' />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    {/* Buttons */}    
                    <input type='file' accept='image/*' capture='camera' className='uploadInput' onChange={uploadImage} ref={fileInputRef} multiple style={{ display: "none" }} id="upload-image"/>
                    <label htmlFor="upload-image">
                          <Button variant="outlined" color="secondary" component="span" style={{background: 'white', color: 'black', marginRight:'10px'}}>
                            UPLOAD IMAGE
                          </Button>
                    </label>
                                            
                    <Button className='button' onClick={identify} variant="contained" color="secondary" component="span">DETECT</Button>
                </Grid>

                {/* <input type='hidden' className={this.imageURL} onChange={uploadImage} style={{ display: "none" }}/> */}
                {/* Filter */}
                <Grid item xs={12} md={6} lg={4}>
                      {/* <Filter 
                        typeLabel="Class Name"
                        name="satellite"
                        id="satellite-class"
                        value="AnnualCrop"
                        valueLabel="AnnualCrop"
                      />
                  {uniqueCouse && (
                    <select>
                    {uniqueCouse.map(item => (
                      <option key={item[1]} value={item[1]}>
                        {item[2]}
                      </option>
                    ))}
                    {console.log(uniqueCouse)}
                  </select>
                  )}
                   */}
                </Grid>

                {/* Image Preview
                <Grid item xs={6} md={6} lg={6}>  
                  <ImagePreview />
                </Grid> */}
                <Grid item xs={6} md={6} lg={6}>
                  <Typography variant="h5" gutterBottom className={classes.previewHeader} >
                      Image Preview
                  </Typography>

                  {imageURL && (
                    <div className="imageHolder">
                        {imageURL.map((key, value) => {
                          
                        return <img name={key[1]} src={key[0]} alt="Upload Preview" crossOrigin="anonymous"  style={{height: '375px', width: '564px', marginBottom: '55px'}} />;
                        })}
                    </div>
                    )}
                </Grid> 
                {/* Result */}
                <Grid item xs={6} md={6} lg={6}>
                  {/* <Box mt={7}>   
                    <Result 
                      index="1"
                      filename="AnnualCrop_1999.jpg"
                      classname="AnnualCrop"
                      confidence="99.9%"
                    /> */}

                {results.length > 0 && <div className='resultsHolder'>
                    {results.map((result, index) => {
                        return (
                        <Box mt={7}>  
                        <div className='result' key={result}>
                          <Result 
                            index={result[0]}
                            filename={result[1]}
                            classLabel={"IMAGE CLASS"}
                            classname={result[2]}
                            confidence={(result[3] * 100).toFixed(2)}
                          />
                          </div>
                          </Box>
                        )
                    })}
                </div>}
                </Grid>

                {/* Buttons */}
                <Grid item xs={6} md={6} lg={6} container justify="center">    
                </Grid>

                {/* Export Button */} 
                <Grid item xs={12} md={6} lg={6} container justify="center" style={{textAlign:'center'}}>
                  <div>
                    <ReactHTMLTableToExcel
                      table="export-to-xlsx"
                      filename="results"
                      sheet="results"
                      buttonText="EXPORT XLSX"/>

                    <table id="export-to-xlsx" style={{display:"none"}}>
                      <thead>
                          <tr>
                            <th width="10%">Index</th>
                            <th width="40%">File Name</th>
                            <th width="40%">Class Name</th>
                            <th width="40%">Confidence Level</th>
                          </tr>
                          </thead>
                          
                          {results.length > 0 && <tbody>
                            {results.map(result => (
                                <tr key={result}>
                                  <td>{result[0]}</td>
                                  <td>{result[1]}</td>
                                  <td>{result[2]}</td>
                                  <td>{result[3]}</td>
                                </tr>
                              ))}
                              </tbody>
                            }
                      </table>
                    </div>
                </Grid>
            </Grid>
        </Container>
      </main>
      </ThemeProvider>
    </div>
    </React.Fragment>
  );
}