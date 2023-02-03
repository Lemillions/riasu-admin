import { Link, Outlet } from "react-router-dom";
import Logo from "../assets/logo.svg";
import "../route.css";
import { BsFilm, BsDisplay } from "react-icons/bs";
import { AiOutlineUser, AiOutlineHome } from "react-icons/ai";
import { FaTheaterMasks } from "react-icons/fa";
import { FiPackage } from "react-icons/fi"

export default function Root() {
  return (
    <div id="container">
      <nav id="sideMenu">
        <img src={Logo} id="logo" />
        <Link to={"../"} className="menuOption">
          <AiOutlineHome size={16} />
          &nbsp;&nbsp;&nbsp;Dashboard
        </Link>
        <Link to={"user"} className="menuOption">
          <AiOutlineUser size={16} />
          &nbsp;&nbsp;&nbsp;Usuários
        </Link>
        <Link to={"product"} className="menuOption">
          <FiPackage size={16} />
          &nbsp;&nbsp;&nbsp;Planos
        </Link>
        <Link to={"channel"} className="menuOption">
          <BsDisplay size={16} />
          &nbsp;&nbsp;&nbsp;Canais
        </Link>
        <Link to={"film"} className="menuOption">
          <BsFilm size={16} />
          &nbsp;&nbsp;&nbsp;Filmes
        </Link>
        <Link to={"genre"} className="menuOption">
          <FaTheaterMasks size={16} />
          &nbsp;&nbsp;&nbsp;Géneros
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
