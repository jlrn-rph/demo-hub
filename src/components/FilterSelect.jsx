import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import { theme } from './Style';

const styles = () => ({
    formControl: {
        margin: theme.spacing(0.5),
        minWidth: 120,
    },
});

const Filter = ({ classes, typeLabel, name, id, value, valueLabel }) => {
    return(
        <ThemeProvider theme={theme}>
            <FormGroup>
                <FormLabel>FILTER BY:</FormLabel>    
                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel htmlFor="filled-age-native-simple">{ typeLabel }</InputLabel>
                    <Select native inputProps={{
                        name: { name },
                        id: { id },
                    }}>
                        <option aria-label="None" value="" />
                        <option value={ value }>{ valueLabel }</option>
                    </Select>
                </FormControl>
            </FormGroup>
        </ThemeProvider>
    );
}

export default withStyles(styles)(Filter);