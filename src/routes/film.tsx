import "../styles/film.css";
import { Input, Modal, Tooltip, Select, message, Button, Popconfirm } from "antd";
import { MdOutlineAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

interface Filme {
  id: string;
  name: string;
  description?: string;
  src: string;
  banner: string;
  genres: string[];
  products?: string[];
  createdAt: string;
}
export default function Film() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [buscaInput, setBuscaInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [listaGeneros, setListaGeneros] = useState<any[]>([]);
  const [form, setForm] = useState<Filme>({
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
      .get("film")
      .then((res) => setFilmes(res.data))
      .catch((err) => console.log(err));

    api
      .get("genre")
      .then((res) => setListaGeneros(res.data))
      .catch((err) =>
        message.error(
          "Ocorreu um erro e não vai ser possivel selecionar os generos!"
        )
      );
  }, []);
  const navigate = useNavigate();
  const filmesFiltrados = buscaInput.length
    ? filmes.filter((e) =>
        e.name.toUpperCase().includes(buscaInput.toUpperCase())
      )
    : filmes;

  const showModal = (filme: Filme) => {
    setForm({ ...filme, genres: filme.genres.map((e: any) => e.genreId) });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    api
      .put(`film/${form.id}`, {
        name: form.name,
        description: form.description,
        src: form.src,
        banner: form.banner,
      })
      .then((res) => {
        api
          .post(`film/${res.data.id}/genre`, form.genres)
          .catch((err) =>
            message.error("Ocorreu um erro ao adicionar generos!")
          );
      })
      .catch((err) => message.error("Ocorreu um erro ao editar o filme!"));

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div id="filmContainer">
      <header>
        <h1>Filmes</h1>
      </header>
      <div id="produtosContainer">
        <div id="inputsContainer">
          <div style={{ width: "500px" }}>
            <Input.Search
              placeholder="Pesquisar Filmes"
              onChange={(e) => setBuscaInput(e.currentTarget.value)}
              size="large"
            />
          </div>
          <button onClick={() => navigate("/film/create")}>
            <MdOutlineAdd size={16} color="#fff" />
            Criar Filme
          </button>
        </div>
        <div id="listaFilmes">
          <div id="headerLista">
            <span className="filmeNome">Nome</span>
            <span className="filmeDescricao">Descrição</span>
            <span className="filmeData">Data de Criação</span>
          </div>
          <Modal
            title="Atualizar filme"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancelar
              </Button>,
              <Popconfirm
                title="Deletar Filme"
                description="Você tem certeza que deseja deletar esse Filme ?"
                onConfirm={() => {
                  api.delete(`film/${form.id}`).then((res) => {
                    message.success("Filme deletado com sucesso!");
                    setIsModalOpen(false);
                  }).catch((err) => {
                    message.error("Ocorreu um erro ao deletar o filme!");
                  });
                  setIsModalOpen(false);
                }}
                okText="Sim"
                cancelText="Não"
              >
                <Button key="delete" onClick={() => {}} type="primary" danger>
                  Deletar Filme
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
            <label>Descrição :</label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.currentTarget.value })
              }
              style={{ marginBottom: "5px" }}
            />
            <label>Link do filme :</label>
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
          {filmesFiltrados
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((filme: Filme) => {
              return (
                <div className="filmeInfo" key={filme.id}>
                  <span
                    className="filmeNome"
                    onClick={() => showModal(filme)}
                    style={{ color: "#3636ff", cursor: "pointer" }}
                  >
                    {filme.name}
                  </span>
                  <span className="filmeDescricao">{filme.description}</span>
                  <span className="filmeData">
                    {new Date(filme.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
