import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Valve from './pages/Valve'
import Satellite from './pages/Satellite'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/valve">
          <Valve />
        </Route>

        <Route path="/satellite">
          <Satellite />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
