import "../styles/user.css";
import { Input, Tooltip } from "antd";
import { MdOutlineAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { api } from "../../api";

interface Usuario {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  status: string;
  createdAt: string;
}

export default function User() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [buscaInput, setBuscaInput] = useState<string>("");
  const usuariosFiltrados = buscaInput.length
    ? usuarios.filter(
        (e) =>
          e.name.includes(buscaInput) ||
          e.email.includes(buscaInput) ||
          e.username.includes(buscaInput)
      )
    : usuarios;

  useEffect(() => {
    api
      .get("user")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div id="userContainer">
      <header>
        <h1>Usuários</h1>
      </header>
      <div id="usuariosContainer">
        <div id="inputsContainer">
          <div style={{ width: "500px" }}>
            <Input.Search
              placeholder="Pesquisar usuarios"
              onChange={(e) => setBuscaInput(e.currentTarget.value)}
              enterButton
              size="large"
            />
          </div>
          <button>
            <MdOutlineAdd size={16} color="#fff" /> Criar Usuário
          </button>
        </div>
        <div id="listaUsuarios">
          <div id="headerLista">
            <span className="usuarioNome">Nome</span>
            <span className="usuarioUser">Username</span>
            <span className="usuarioEmail">Email</span>
            <span className="usuarioStatus">Status</span>
            <span className="usuarioData">Data de criação</span>
          </div>
          {usuariosFiltrados.map((usuario: Usuario) => {
            return (
              <div className="usuarioInfo">
                <Tooltip title={usuario.name}>
                  <span className="usuarioNome">{usuario.name}</span>
                </Tooltip>
                <Tooltip title={usuario.username}>
                  <span className="usuarioUser">{usuario.username}</span>
                </Tooltip>
                <Tooltip title={usuario.email}>
                  <span className="usuarioEmail">{usuario.email}</span>
                </Tooltip>
                <span className="usuarioStatus">
                  <span
                    style={
                      usuario.status == "ACTIVE"
                        ? {
                            border: "1px solid #84ff4f",
                            backgroundColor: "#84ff4f49",
                            color: "green",
                            padding: "4px",
                            borderRadius: "4px",
                          }
                        : {
                            border: "1px solid #fa343481",
                            backgroundColor: "#fa34342f",
                            color: "red",
                            padding: "4px",
                            borderRadius: "4px",
                          }
                    }
                  >
                    {usuario.status}
                  </span>
                </span>
                <span className="usuarioData">
                  {new Date(usuario.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
