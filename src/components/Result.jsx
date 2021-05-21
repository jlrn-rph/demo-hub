import { Typography, Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import { theme } from './Style';

const styles = theme => ({
    title: {
        backgroundColor: "#00037C", 
        fontWeight: 500, 
        color: '#fff',
        borderRadiusTop:'10px'
    },
    subtitle:{
        color: theme.palette.secondary.dark,
        fontWeight: 500
    },
    divider:{
        marginBottom: '11px'
    },
    cardContent: {
        padding: '0px 20px 0px 20px', 
    }
});

const Result = ({ classes, index, filename, classname, confidence }) => {
    return(
        <ThemeProvider theme={theme}> 
            <CardHeader title="Result" className={classes.title} />
                 <Card className={classes.cardContent}>
                    <CardContent>
                        <Typography variant="subtitle1" className={classes.subtitle}> INDEX </Typography>
                        <Typography variant="h6">{ index }</Typography>
                        <Divider className={classes.divider} />

                        <Typography variant="subtitle1" className={classes.subtitle}> FILE NAME </Typography>
                        <Typography variant="h6">{ filename }</Typography>
                        <Divider className={classes.divider} />

                        <Typography variant="subtitle1" className={classes.subtitle}> VALVE TYPE </Typography>
                        <Typography variant="h6">{ classname }</Typography>
                        <Divider className={classes.divider} />

                        <Typography variant="subtitle1" className={classes.subtitle}> CONFIDENCE LEVEL </Typography>
                        <Typography variant="h6">{ confidence }</Typography>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}

export default withStyles(styles)(Result);