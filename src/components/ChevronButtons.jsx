import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { theme } from "./Style";

const styles = () => ({
  default: {
    marginRight: "100px",
  },
});

const ChevronButton = ({ classes }) => {
  return (
    <ThemeProvider theme={theme}>
      <ChevronLeftIcon className={classes.default} />
      <ChevronRightIcon />
    </ThemeProvider>
  );
};

export default withStyles(styles)(ChevronButton);
