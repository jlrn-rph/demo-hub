import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import { theme } from './Style';

const styles = () => ({
    cardMedia: {
        paddingTop: '66.25%', // 16:9
    },
    header:{
        fontWeight: 500,
        color: "#263238",
        paddingTop: "20px"
    }
});

const ImageCard = ({ classes }) => {
    return(
        <ThemeProvider theme={theme}>
            <Typography variant="h5" gutterBottom className={classes.header}>
                Image Preview
            </Typography>
            <Card>
                <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                    />
            </Card>
        </ThemeProvider>
    );
}

// CustomButton.propTypes = {
//     label:PropTypes.string,
//     color: PropTypes.string,
// }

export default withStyles(styles)(ImageCard);