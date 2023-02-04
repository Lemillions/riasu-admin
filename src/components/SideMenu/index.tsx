import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import "./index.css";
import { BsFilm, BsDisplay } from "react-icons/bs";
import { AiOutlineUser, AiOutlineHome } from "react-icons/ai";
import { FaTheaterMasks } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function SideMenu() {

  const [rotaAtiva, setRotaATiva] = useState<string>(location.pathname);

  return (
    <nav id="sideMenu">
      <img src={Logo} id="logo" />
      <Link
        to={"../"}
        className="menuOption"
        onClick={() => {
          setRotaATiva("/");
        }}
        style={rotaAtiva == "/" ? { backgroundColor: "#4996FF" } : {}}
      >
        <AiOutlineHome size={16} />
        &nbsp;&nbsp;&nbsp;Dashboard
      </Link>
      <Link
        to={"user"}
        className="menuOption"
        onClick={() => {
          setRotaATiva("/user");
        }}
        style={rotaAtiva.includes("/user") ? { backgroundColor: "#4996FF" } : {}}
      >
        <AiOutlineUser size={16} />
        &nbsp;&nbsp;&nbsp;Usuários
      </Link>
      <Link
        to={"product"}
        className="menuOption"
        onClick={() => {
          setRotaATiva("/product");
        }}
        style={rotaAtiva.includes("/product") ? { backgroundColor: "#4996FF" } : {}}
      >
        <FiPackage size={16} />
        &nbsp;&nbsp;&nbsp;Planos
      </Link>
      <Link
        to={"channel"}
        className="menuOption"
        onClick={() => {
          setRotaATiva("/channel");
        }}
        style={rotaAtiva.includes("/channel") ? { backgroundColor: "#4996FF" } : {}}
      >
        <BsDisplay size={16} />
        &nbsp;&nbsp;&nbsp;Canais
      </Link>
      <Link
        to={"film"}
        className="menuOption"
        onClick={() => {
          setRotaATiva("/film");
        }}
        style={rotaAtiva.includes("/film") ? { backgroundColor: "#4996FF" } : {}}
      >
        <BsFilm size={16} />
        &nbsp;&nbsp;&nbsp;Filmes
      </Link>
      <Link
        to={"genre"}
        className="menuOption"
        onClick={() => {
          setRotaATiva("/genre");
        }}
        style={rotaAtiva.includes("/genre") ? { backgroundColor: "#4996FF" } : {}}
      >
        <FaTheaterMasks size={16} />
        &nbsp;&nbsp;&nbsp;Géneros
      </Link>
    </nav>
  );
}
