import React from 'react'
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';  
import Paper from '@material-ui/core/Paper';
import { Button, ThemeProvider } from '@material-ui/core';
import { useStyles, theme } from '../components/Style';
import Sidebar from '../components/Nav';
import Title from '../components/Title';
import CustomButton from '../components/Buttons';
import ImagePreview from '../components/ImagePreview';
import Filter from '../components/FilterSelect';
import Result from '../components/Result';
import ChevronButtons from '../components/ChevronButtons';
import { useState, useEffect, useRef } from 'react';
import * as tf from "@tensorflow/tfjs";
export default function Home() {
  const classNames = ['defective', 'good'];
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);
  const fileInputRef = useRef();
    let classes = useStyles();
    let image = [];
    let Output = [];
    let images = document.images; 
    console.log(results);
    //Load Model
    const loadModel = async () => {
      setIsModelLoading(true);
      try {
          const model = await tf.loadLayersModel("http://localhost:81/valve/model.json");
          global.fetch = require('node-fetch');
          setModel(model);
          setIsModelLoading(false);
      } catch (error) {
          console.log(error);
          setIsModelLoading(false);
      }
  }
    const uploadImage = (e) => {
          setResults('');
           for (let i = 0; i < e.target.files.length; i++) {
           const url = URL.createObjectURL(e.target.files[i]);
           const filename = e.target.files[i].name;
               image.push([url,filename]);
           }
          setImageURL(image);
   }

   const identify = async () => {
    for(var i = 0; i < images.length; i++){
      const predictions = await model.predict(tf.browser
        .fromPixels(images[i])
        .resizeNearestNeighbor([224, 224])
        .cast('float32').expandDims());
  
      let name = images[i].attributes[0].textContent.split("/");
      let nameSplit = name[name.length - 1];
  
      // image predictions
        if(predictions.dataSync()[0] >= 1){
          Output.push([
            i+1,
            nameSplit,
            "good",
            predictions.dataSync()[0]
          ]);
        } else {
          Output.push([
            i+1,
            nameSplit,
            "defective",
            predictions.dataSync()[0]
          ]);
      }
    }
    
    setResults(Output);
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
                            <Title title = 'Valve Inspection' />
                            <Title description = 'Upload valve images and get valve classification results' />
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
                        {imageURL && <button className='button' onClick={identify}>Identify Image</button>}
                    </Grid>

                    {/* Filter */}
                    <Grid item xs={12} md={6} lg={4}>
                      <Filter 
                        typeLabel="Valve Type"
                        name="valve"
                        id="valve-class"
                        value="Good"
                        valueLabel="Good"
                      />
                    </Grid>

                    {/* Image Preview */}
                    <Grid item xs={6} md={6} lg={6}> 
                      {imageURL && (
                        <div className="imageHolder">
                            {imageURL.map((key, value) => {
                              
                            return <img name={key[1]} src={key[0]} talt="Upload Preview" crossOrigin="anonymous" style={{height: '336px', width: '336px',}} />;
                            })}
                        </div>
                        )}
                    </Grid> 

                    {/* Result */}
                    <Grid item xs={6} md={6} lg={6}>
                    {results.length > 0 && <div className='resultsHolder'>
                        {results.map((result, index) => {
                            return (
                            <Box mt={7}>  
                            <div className='result' key={result}>
                              <Result 
                                index={result[0]}
                                filename={result[1]}
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
                        <ChevronButtons />
                    </Grid>

                    {/* Export Button */} 
                    <Grid item xs={12} md={6} lg={6} container justify="center">
                        <CustomButton variant="contained" color="secondary" label="EXPORT CSV "></CustomButton>
                    </Grid>

                </Grid>
            </Container>
          </main>
          </ThemeProvider>
        </div>
        </React.Fragment>
      );
    }