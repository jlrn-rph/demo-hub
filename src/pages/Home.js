import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Sidebar from "../components/Nav";
import { useStyles } from "../components/Style";
import Card from "../components/Card";
import Title from "../components/Title";

export default function Home() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <Sidebar />
      <div>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Title title="Demo Hub" />
                  <Title description="See solution demos built by Cawil.AI" />
                </Paper>
              </Grid>

              {/* Card */}
              <Grid item xs={12} md={12} lg={12}>
                <Card />
              </Grid>
            </Grid>
          </Container>
        </main>
      </div>
    </React.Fragment>
  );
}
