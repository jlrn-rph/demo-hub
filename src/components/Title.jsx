import React from 'react'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import { theme } from '../components/Style';

const styles = () => ({
  title: {
      color: "#2E383D",
      fontWeight: 500, 
      paddingBottom:"10px"
  },
});

 const Title = ({title, description, classes})=> {
  return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Typography variant="h3" component="h1" className={classes.title}>
    {title}
    </Typography>
    
    <Typography noWrap>
      {description}
     </Typography>
  </ThemeProvider>
  )
}

Title.propTypes = {
  title:PropTypes.string,
  description: PropTypes.string,
}

export default withStyles(styles)(Title);