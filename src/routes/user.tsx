import "../styles/user.css";
import {
  Input,
  Modal,
  Tooltip,
  Select,
  message,
  Button,
  Popconfirm,
} from "antd";
import { MdOutlineAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

interface Usuario {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  status: string;
  createdAt: string;
  products: any[];
}

export default function User() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [buscaInput, setBuscaInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [listaProdutos, setListaProdutos] = useState<any[]>([]);
  const [form, setForm] = useState<Usuario>({
    id: "",
    name: "",
    username: "",
    email: "",
    password: "",
    status: "ACTIVE",
    createdAt: "",
    products: [],
  });
  useEffect(() => {
    api
      .get("user")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.log(err));

    api
      .get("product")
      .then((res) => setListaProdutos(res.data))
      .catch((err) =>
        message.error(
          "Ocorreu um erro e não vai ser possivel selecionar os planos"
        )
      );
  }, []);
  const navigate = useNavigate();
  const usuariosFiltrados = buscaInput.length
    ? usuarios.filter(
        (e) =>
          e.name.toUpperCase().includes(buscaInput) ||
          e.email.toUpperCase().includes(buscaInput) ||
          e.username.toUpperCase().includes(buscaInput)
      )
    : usuarios;

  const showModal = (user: Usuario) => {
    setForm({
      ...user,
      products: user.products.map((produto) => {
        return produto.productId;
      }),
    });
    setIsModalOpen(true);
  };
  const handleOk = () => {
    api
      .put(`user/${form.id}`, {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        status: form.status,
      })
      .then((res) => {
        message.success("Usuario atualizado com sucesso!");
        setUsuarios([...usuarios.filter((e) => e.id != form.id), form]);
        api.post(`user/${res.data.id}/product`, form.products).catch((err) => {
          message.error("Ocorreu um erro ao adicionar planos");
        });
      });
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    console.log("Cancel");
    setIsModalOpen(false);
  };
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
              size="large"
            />
          </div>
          <button onClick={() => navigate("/user/create")}>
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
          <Modal
            title="Atualizar usuário"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancelar
              </Button>,
              <Popconfirm
                title="Deletar Usuário"
                description="Você tem certeza que deseja deletar esse usuário ?"
                onConfirm={() => {
                  api
                    .delete(`user/${form.id}`)
                    .then((res) => {
                      message.success("Usuario deletado com sucesso!");
                      setUsuarios(usuarios.filter((e) => e.id != form.id));
                    })
                    .catch((err) => {
                      message.error("Ocorreu um erro ao deletar o usuário");
                    });
                  setIsModalOpen(false);
                }}
                okText="Sim"
                cancelText="Não"
              >
                <Button key="delete" onClick={() => {}} type="primary" danger>
                  Deletar Usuário
                </Button>
              </Popconfirm>,
              <Button key="submit" type="primary" onClick={handleOk}>
                Salvar alterações
              </Button>,
            ]}
          >
            <label>Nome :</label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.currentTarget.value })
              }
              style={{ marginBottom: "5px" }}
            />
            <label>Username :</label>
            <Input
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.currentTarget.value })
              }
              style={{ marginBottom: "5px" }}
            />
            <label>Email :</label>
            <Input
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.currentTarget.value })
              }
              style={{ marginBottom: "5px" }}
            />
            <div>
              <label>Senha :</label>
              <Input
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.currentTarget.value })
                }
              />
              <label>Status :</label>
              <Select
                defaultValue={form.status}
                onChange={(e) => setForm({ ...form, status: e })}
                style={{
                  width: 120,
                  marginLeft: "5px",
                  marginTop: "5px",
                }}
                options={[
                  {
                    value: "ACTIVE",
                    label: "ACTIVE",
                  },
                  {
                    value: "INACTIVE",
                    label: "INACTIVE",
                  },
                ]}
              />
            </div>
            <label>Planos :</label>
            <Select
              mode="multiple"
              placeholder="Selecione os planos"
              style={{ width: "100%" }}
              value={form.products.map((e: any) => e)}
              onChange={(e) => setForm({ ...form, products: e })}
              options={listaProdutos.map((produto) => {
                return { label: produto.name, value: produto.id };
              })}
            />
          </Modal>
          {usuariosFiltrados
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((usuario: Usuario) => {
              return (
                <div className="usuarioInfo" key={usuario.id}>
                  <Tooltip title={usuario.name}>
                    <span className="usuarioNome">{usuario.name}</span>
                  </Tooltip>
                  <Tooltip title={usuario.username}>
                    <span
                      className="usuarioUser"
                      onClick={() => showModal(usuario)}
                      style={{ color: "#3636ff", cursor: "pointer" }}
                    >
                      {usuario.username}
                    </span>
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
                              backgroundColor: "#84ff4f26",
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
