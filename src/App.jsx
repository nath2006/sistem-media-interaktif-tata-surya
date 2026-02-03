import { Route, Switch } from "wouter"; // Switch is not strictly needed but good for exclusion
import Home from "./pages/Home";
import GravitySimulation from "./pages/GravitySimulation";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/gravity" component={GravitySimulation} />
      <Route>404: Page Not Found</Route>
    </Switch>
  );
}
