import { Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import "../route.css";

export default function Root() {
  return (
    <div id="container">
      <SideMenu />
      <Outlet />
    </div>
  );
}
