import React from 'react'
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';  
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core';
import { useStyles, theme } from '../components/Style';
import Sidebar from '../components/Nav';
import Title from '../components/Title';
import CustomButton from '../components/Buttons';
import ImagePreview from '../components/ImagePreview';
import Filter from '../components/FilterSelect';
import Result from '../components/Result';
import ChevronButtons from '../components/ChevronButtons';

export default function Home() {
      let classes = useStyles();
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
                            <Title description = 'Upload satellite images and get valve classification results' />
                        </Paper>
                    </Grid>
    
                    <Grid item xs={12} md={6} lg={6}>
                        {/* Buttons */}    
                        <CustomButton variant="outlined" color="secondary" label="UPLOAD IMAGE"></CustomButton>
                        <CustomButton variant="contained" color="secondary" label="DETECT"></CustomButton>
                    </Grid>

                    {/* Filter */}
                    <Grid item xs={12} md={6} lg={4}>
                      <Filter 
                        typeLabel="Class Name"
                        name="satellite"
                        id="satellite-class"
                        value="AnnualCrop"
                        valueLabel="AnnualCrop"
                      />
                    </Grid>

                    {/* Image Preview */}
                    <Grid item xs={6} md={6} lg={6}>  
                      <ImagePreview />
                    </Grid>

                    {/* Result */}
                    <Grid item xs={6} md={6} lg={6}>
                      <Box mt={7}>   
                        <Result 
                          index="1"
                          filename="AnnualCrop_1999.jpg"
                          classname="AnnualCrop"
                          confidence="99.9%"
                        />
                      </Box>
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