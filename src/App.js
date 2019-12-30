import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./containers/main/main";
import Login from "./containers/login/login";
import Register from "./containers/register/register";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route component={Main} />
        </Switch>
      </Router>
    </div>
  );
}
export default App;
