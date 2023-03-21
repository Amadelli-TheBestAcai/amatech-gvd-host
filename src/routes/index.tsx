import { Switch, Route } from "react-router-dom";


import Login from "../pages/Login";

const Routes = () => {
  return (
    <Switch>
          <Route path="*" component={Login} />
        </Switch>
  );
};

export default Routes;
