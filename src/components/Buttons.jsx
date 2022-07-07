import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import { theme } from "./Style";

const styles = () => ({
  secondary: {
    background: "white",
    color: "black",
    marginRight: "15px",
  },
});

const CustomButton = ({ variant, color, classes, label }) => {
  return (
    <ThemeProvider theme={theme}>
      <Button
        variant={variant}
        color={color}
        classes={{ outlinedSecondary: classes.secondary }}
      >
        {label}
      </Button>
    </ThemeProvider>
  );
};

CustomButton.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
};

export default withStyles(styles)(CustomButton);
