import "../styles/channel.css";
import { Input, Modal, Tooltip, Select, message } from "antd"
import { MdOutlineAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

interface Canal {
  id: string;
  name: string;
  description?: string;
  src: string;
  banner: string;
  genres: string[];
  products?: string[];
  createdAt: string;
}
export default function Channel() {
  const [canais, setCanais] = useState<Canal[]>([]);
  const [buscaInput, setBuscaInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [listaGeneros, setListaGeneros] = useState<any[]>([]);
  const [form, setForm] = useState<Canal>({
    id: "",
    name: "",
    description: "",
    src: "",
    banner: "",
    genres: [],
    products: [],
    createdAt: "",
  });

  useEffect(() => {
    api
      .get("channel")
      .then((res) => setCanais(res.data))
      .catch((err) => console.log(err));

    api
      .get("genre")
      .then((res) => setListaGeneros(res.data))
      .catch((err) =>
        message.error(
          "Ocorreu um erro e não vai ser possivel selecionar os generos!"
        )
      );
  });
  const navigate = useNavigate();
  const canaisFiltrados = buscaInput.length
    ? canais.filter((e) =>
        e.name.toUpperCase().includes(buscaInput.toUpperCase())
      )
    : canais;

  const showModal = (canal: Canal) => {
    setForm({ ...canal, genres: canal.genres.map((e: any) => e.genreId) });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    api
      .put(`channel/${form.id}`, {
        name: form.name,
        description: form.description,
        src: form.src,
        banner: form.banner,
      })
      .then((res) => {
        api
          .post(`channel/${res.data.id}/genre`, form.genres)
          .catch((err) =>
            message.error("Ocorreu um erro ao adicionar generos!")
          );
      })
      .catch((err) => message.error("Ocorreu um erro ao editar o canal!"));

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div id="channelContainer">
      <header>
        <h1>Canais</h1>
      </header>
      <div id="produtosContainer">
        <div id="inputsContainer">
          <div style={{ width: "500px" }}>
            <Input.Search
              placeholder="Pesquisar Produtos"
              onChange={(e) => setBuscaInput(e.currentTarget.value)}
              size="large"
            />
          </div>
          <button onClick={() => navigate("/channel/create")}>
            <MdOutlineAdd size={16} color="#fff" />
            Criar Canal
          </button>
        </div>
        <div id="listaCanais">
          <div id="headerLista">
            <span className="canalNome">Nome</span>
            <span className="canalDescricao">Descrição</span>
            <span className="canalData">Data de Criação</span>
          </div>
          <Modal
            title="Atualizar canal"
            open={isModalOpen}
            okText={"Salvar alterações"}
            cancelText={"Cancelar"}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <label>Nome :</label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.currentTarget.value })
              }
              style={{ marginBottom: "5px" }}
            />
            <label>Descrição :</label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.currentTarget.value })
              }
              style={{ marginBottom: "5px" }}
            />
            <label>Link do canal :</label>
            <Input
              value={form.src}
              onChange={(e) => setForm({ ...form, src: e.currentTarget.value })}
              style={{ marginBottom: "5px" }}
            />
            <label>Link da imagem :</label>
            <Input
              value={form.banner}
              onChange={(e) =>
                setForm({ ...form, banner: e.currentTarget.value })
              }
              style={{ marginBottom: "5px" }}
            />
            <label>Generos :</label>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Selecione os generos"
              value={form.genres}
              onChange={(e) => setForm({ ...form, genres: e })}
              options={listaGeneros.map((genero) => {
                return { label: genero.name, value: genero.id };
              })}
            />
          </Modal>
          {canaisFiltrados
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((canal: Canal) => {
              return (
                <div className="canalInfo">
                  <span
                    className="canalNome"
                    onClick={() => showModal(canal)}
                    style={{ color: "#3636ff", cursor: "pointer" }}
                  >
                    {canal.name}
                  </span>
                  <span className="canalDescricao">{canal.description}</span>
                  <span className="canalData">
                    {new Date(canal.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
