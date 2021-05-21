import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import SatelliteIcon from '@material-ui/icons/Satellite';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <div>
    <ListItem button component={Link} to="/">
      <ListItemIcon>
        <HomeIcon color="secondary" />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    <ListItem button component={Link} to="/valve">
      <ListItemIcon>
        <SettingsIcon color="secondary" />
      </ListItemIcon>
      <ListItemText primary="Valve Inspection" />
    </ListItem>
    <ListItem button component={Link} to="/satellite">
      <ListItemIcon>
        <SatelliteIcon color="secondary" />
      </ListItemIcon>
      <ListItemText primary="Satellite Classifier" />
    </ListItem>
  </div>
);