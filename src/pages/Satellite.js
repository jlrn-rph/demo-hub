import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useStyles, theme } from '../components/Style';
import Sidebar from '../components/Nav';
import Title from '../components/Title';
import Filter from '../components/FilterSelect';
import Result from '../components/Result';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';  
import Paper from '@material-ui/core/Paper';
import { Button, ThemeProvider, Typography } from '@material-ui/core';
import ReactPaginate from "react-paginate";
import CsvDownloader from 'react-csv-downloader';
import MUIDataTable from "mui-datatables";
import * as tf from "@tensorflow/tfjs";

export default function Home() {
  const classNames = ['AnnualCrop', 'Forest', 'HerbaceousVegetation', 'Highway', 'Industrial', 'Pasture', 'PermanentCrop', 'Residential', 'River', 'SeaLake'];
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState([]);
  const [results, setResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [uniqueCouse, SetUniqueCourse] = useState(null); 
  const fileInputRef = useRef();
  let classes = useStyles();
  let image = [];
  let Output = [];
  let images = document.images; 

  console.log(uniqueCouse);

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
      for (let i = 0; i < e.target.files.length; i++) {
      const url = URL.createObjectURL(e.target.files[i]);
      const filename = e.target.files[i].name;
          image.push([i+1, url,filename]);
      }
    setImageURL(image);
  }

  //Detect Image
  const identify = async () => {
    for(let i = 0; i < images.length; i++){
      const results = await model.predict(tf.browser
        .fromPixels(images[i])
        .resizeNearestNeighbor([224, 224])
        .cast('float32').expandDims());

      let name = images[i].attributes[0].textContent.split("/");
      let index = images[i].attributes[1].textContent.split("/");
      const labelPrediction = results.as1D().argMax().dataSync()[0]; //get class name
        
      Output.push([index,name,classNames[labelPrediction],results.dataSync()[0]]);
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

  const imagePerPage = 2;
  const pagesVisited = pageNumber * imagePerPage;
  const displayImages = imageURL
  .slice(pagesVisited, pagesVisited + imagePerPage)
  .map((key) =>  {
      return (
        <img name={key[2]} id={key[0]} src={key[1]} crossOrigin="anonymous" style={{height: '375px', width: '564px',}} />
      )
  })

  const pageCount = Math.ceil(imageURL.length/imagePerPage);
  const changePage = ({selected}) => {
    setPageNumber(selected);
    identify();
  }

  const columns = [{
    id: 'index',
    displayName: 'index'
  }, 
  {
    id: 'filename',
    displayName: 'filename'
  },
  {
    id: 'classname',
    displayName: 'classname'
  },
  {
    id: 'confidence_level',
    displayName: 'confidence_level'
  }
];

  const datas =
  [
    {
    index: Output[0],
    filename: Output[1],
    classname: Output[2],
    confidence_level: Output[3] 
  }
];

  const cols = [{
    id: 'index',
    name: 'index'
  }, 
  {
    id: 'filename',
    name: 'filename'
  },
  {
    id: 'classname',
    name: 'classname'
  },
  {
    id: 'confidence_level',
    name: 'confidence_level'
  }
];

  const data =
    [
      {
      index: results[0],
      filename: results[1],
      classname: results[2],
      confidence_level: results[3] 
    }
  ];

  const options = {
    filterType: 'checkbox',
  };
  
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
                                        
                {imageURL && <Button className='button' onClick={identify} variant="contained" color="secondary" component="span">DETECT</Button>}
            </Grid>

            {/* <input type='hidden' className={this.imageURL} onChange={uploadImage} style={{ display: "none" }}/> */}
            {/* Filter */}
            <Grid item xs={12} md={6} lg={4}>
              <Filter 
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
          </Grid>

          <Grid item xs={6} md={6} lg={6}> 
            {/* {imageURL && (
              <div className="imageHolder">
                  {imageURL.map((key, value) => {
                    
                  return <img name={key[1]} src={key[0]} talt="Upload Preview" crossOrigin="anonymous" style={{height: '336px', width: '336px',}} />;
                  })}
              </div>
              )} */}
            {imageURL && <Typography variant="h5" gutterBottom className={classes.previewHeader} >
              Image Preview
            </Typography>}
            {displayImages}
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
            <ReactPaginate 
              previousLabel={"<"}
              nextLabel={">"}
              pageCount={pageCount}
              onPageChange={changePage}
              pageRangeDisplayed={5}
              containerClassName={"paginationButtons"}
              previousLinkClassName={"previousButton"}
              nextLinkClassName={"nextButton"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </Grid>

          {/* Export Button */} 
          <Grid item xs={12} md={6} lg={6} container justify="center" style={{paddingBottom: '50px'}}>
              {/* <CustomButton variant="contained" color="secondary" label="EXPORT CSV "></CustomButton> */}
              <CsvDownloader
              filename="myfile"
              extension=".csv"
              columns={columns}
              datas={datas}>
            <Button className='button' variant="contained" color="secondary" component="span">EXPORT CSV</Button>
            </CsvDownloader>
          </Grid>
      </Grid>
        
      <Grid item xs={12} md={6} lg={12}>
        <MUIDataTable 
            title={"All Results"} 
            data={data} 
            columns={cols} 
            options={options} 
          />
      </Grid>

        </Container>
      </main>
      </ThemeProvider>
    </div>
    </React.Fragment>
  );
}