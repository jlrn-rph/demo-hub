import React from 'react'
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';  
import Paper from '@material-ui/core/Paper';
import { Button, ThemeProvider, Typography} from '@material-ui/core';
import { useStyles, theme } from '../components/Style';
import Sidebar from '../components/Nav';
import Title from '../components/Title';
import CustomButton from '../components/Buttons';
import ImagePreview from '../components/ImagePreview';
import Filter from '../components/FilterSelect';
import Result from '../components/Result';
import Carousel from 'react-elastic-carousel'
import Card from '@material-ui/core/Card';
import ReactPaginate from "react-paginate";
import CardMedia from '@material-ui/core/CardMedia';
import { useState, useEffect, useRef } from 'react';
import CsvDownloader from 'react-csv-downloader';
import Select from '@material-ui/core/Select';
import * as tf from "@tensorflow/tfjs";

export default function Home() {
  const classNames = ['Defective', 'Good'];
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState([]);
  const [results, setResults] = useState([]);
  const [resultsY, setResultsY] = useState([]);
  const [search, setSearch] = useState('');
  const [button, setButton] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const fileInputRef = useRef();
  let classes = useStyles();
  let image = [];
  let Output = [];
  let x = [];
  let y = [];
  let images = document.images; 
  console.log(x);
  console.log("y", y);
  console.log('res', results);
  console.log('resY', resultsY);
  
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
  const identify = async (e) => {
    // const images = e.target.files;
  for(let i = 0; i < images.length; i++){
    const results = await model.predict(tf.browser
      .fromPixels(images[i])
      .resizeNearestNeighbor([224, 224])
      .cast('float32').expandDims());

    let name = images[i].attributes[0].textContent.split("/");
    let index = images[i].attributes[1].textContent.split("/");
    // let nameSplit = name[name.length - 1];
    const labelPrediction = results.as1D().dataSync()[0];
    y.push({
      index: index,
      file_name: name,
      class_name: classNames[labelPrediction],
      value: results.dataSync()[0]
    });

    Output.push([index,name,classNames[labelPrediction],results.dataSync()[0]]);
  }
    setResults(Output);
    setResultsY(y);
  }

  let jsonfile = JSON.stringify(resultsY, undefined, 2);
  console.log(jsonfile);

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
      index: results[0],
      filename: results[1],
      classname: results[2],
      confidence_level: results[3] 
    }
  ];

  const filter = (button) => {
    const filteredData = results.filter(results[2] === button)
    console.log('filter', filteredData);
    setSearch(filteredData);
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
                        <Button variant="outlined" color="secondary" component="span" style={{background: 'white', color: 'black', marginRight:'15px'}}>
                          UPLOAD IMAGE
                        </Button>
                  </label>

                  {imageURL && <Button className='button' onClick={identify} variant="contained" color="secondary" component="span">DETECT</Button>}
              </Grid>

              {/* Filter */}
              <Grid item xs={12} md={6} lg={4}>
                {/* <Filter 
                  typeLabel="Valve Type"
                  name="valve"
                  id="valve-class"
                  value="Good"
                  valueLabel="Good"
                /> */}
                {/* { results.length > 0 && (
                    <Select style={{ margin: theme.spacing(0.5),
                      minWidth: 120,}}>
                    {results.map(item => (
                      <option key={item[1]} value={item[1]}>
                        {item[2]}
                      </option>
                    ))}
                    {console.log(setUniqueChoice)}
                  </Select>
                  )} */}
                  {/* <input type='text' onChange = {(e) => {
                    setSearch(e.target.value);
                  }}/> */}
                  
                  <button>{filter}</button>
              </Grid>

              {/* Image Preview */}
              <Grid item xs={6} md={6} lg={6}> 
              {imageURL && <Typography variant="h5" gutterBottom className={classes.previewHeader} >
                  Image Preview
              </Typography>}
                {displayImages}
              </Grid> 

              {/* Result */}
              <Grid item xs={6} md={6} lg={6}>
              {results.length > 0 && <div className='resultsHolder'>
                  {results.map((result) => {
                      return (
                      <Box mt={7}>  
                      <div className='result' key={result}>
                        <Result 
                          index={result[0]}
                          filename={result[1]}
                          classname={result[2]}
                          confidence={(result[3])}
                        />
                        </div>
                        </Box>
                      )
                  })}
              </div>}
              </Grid>
                
              {/* Row */}
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
              <Grid item xs={12} md={6} lg={6} container justify="center">
                  <CsvDownloader
                    filename="myfile"
                    extension=".csv"
                    columns={columns}
                    datas={datas}>
                    <Button className='button' variant="contained" color="secondary" component="span">EXPORT CSV</Button>
                  </CsvDownloader>
              </Grid>

          </Grid>
      </Container>
    </main>
    </ThemeProvider>
  </div>
  </React.Fragment>
);
}