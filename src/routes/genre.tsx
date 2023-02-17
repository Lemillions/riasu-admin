import "../styles/genre.css";
import { Input, Modal, Button, Select, message, Popconfirm } from "antd";
import { MdOutlineAdd, MdDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

interface Genero {
  id: string;
  name: string;
  channels: any[];
  films: any[];
  createdAt: string;
}
export default function Genre() {
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [buscaInput, setBuscaInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [listaCanais, setListaCanais] = useState<any[]>([]);
  const [listaFilmes, setListaFilmes] = useState<any[]>([]);
  const [form, setForm] = useState<Genero>({
    id: "",
    name: "",
    channels: [],
    films: [],
    createdAt: "",
  });

  useEffect(() => {
    api
      .get("genre")
      .then((res) => setGeneros(res.data))
      .catch((err) => console.log(err));

    api
      .get("channel")
      .then((res) => setListaCanais(res.data))
      .catch((err) =>
        message.error(
          "Ocorreu um erro e não vai ser possivel selecionar os canais"
        )
      );

    api
      .get("film")
      .then((res) => setListaFilmes(res.data))
      .catch((err) =>
        message.error(
          "Ocorreu um erro e não vai ser possivel selecionar os filmes"
        )
      );
  }, []);
  const navigate = useNavigate();
  const generosFiltrados = buscaInput.length
    ? generos.filter((e) =>
        e.name.toUpperCase().includes(buscaInput.toUpperCase())
      )
    : generos;

  const showModal = (genre: Genero) => {
    setForm({
      ...genre,
      channels: genre.channels.map((channel) => {
        return channel;
      }),
      films: genre.films.map((film) => {
        return film;
      }),
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    api.put(`genre/${form.id}`, { name: form.name }).then((res) => {
      message.success("Plano atualizaodo com sucesso!");
      setGeneros([
        ...generos.filter((e) => e.id != form.id),
        {
          id: form.id,
          name: form.name,
          channels: form.channels,
          films: form.films,
          createdAt: form.createdAt,
        },
      ]);
      api
        .post(
          `genre/${res.data.id}/channel`,
          form.channels.map((e) => e.channelId || e)
        )
        .catch((err) => message.error("Ocorreu um erro ao adicionar canais!"));
      api
        .post(
          `genre/${res.data.id}/film`,
          form.films.map((e) => e.filmId || e)
        )
        .catch((err) => message.error("Ocorreu um erro ao adicionar filmes!"));
    });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div id="genreContainer">
      <header>
        <h1>Genero</h1>
      </header>
      <div id="generosContainer">
        <div id="inputsContainer">
          <div style={{ width: "500px" }}>
            <Input.Search
              placeholder="Pesquisar Generos"
              onChange={(e) => setBuscaInput(e.currentTarget.value)}
              size="large"
            />
          </div>
          <button onClick={() => navigate("/genre/create")}>
            <MdOutlineAdd size={16} color="#fff" />
            Criar Genero
          </button>
        </div>
        <div id="listaGeneros">
          <div id="headerLista">
            <span className="generoNome">Nome</span>
            <span className="generoCanais">Quant. Canais</span>
            <span className="generoCanais">Quant. Filmes</span>
            <span className="generoData">Data de criação</span>
          </div>
          <Modal
            title="Atualizar genero"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancelar
              </Button>,
              <Popconfirm
                title="Deletar Genero"
                description="Você tem certeza que deseja deletar esse genero ?"
                onConfirm={() => {
                  api
                    .delete(`genre/${form.id}`)
                    .then((res) => {
                      message.success("Genero deletado com sucesso!");
                      setGeneros(generos.filter((e) => e.id != form.id));
                    })
                    .catch((err) => {
                      message.error("Ocorreu um erro ao deletar o genero!");
                    });
                  setIsModalOpen(false);
                }}
                okText="Sim"
                cancelText="Não"
              >
                <Button key="delete" onClick={() => {}} type="primary" danger>
                  Deletar Genero
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
            <label>Canais :</label>
            <Select
              mode="multiple"
              placeholder="Selecione os canais"
              style={{ width: "100%" }}
              value={form.channels.map((e: any) => e.channelId || e)}
              onChange={(e) => setForm({ ...form, channels: e })}
              options={listaCanais.map((canal) => {
                return { label: canal.name, value: canal.id };
              })}
            />
            <label>Filmes :</label>
            <Select
              mode="multiple"
              placeholder="Selecione os filmes"
              style={{ width: "100%" }}
              value={form.films.map((e: any) => e.filmId || e)}
              onChange={(e) => setForm({ ...form, films: e })}
              options={listaFilmes.map((filme) => {
                return { label: filme.name, value: filme.id };
              })}
            />
          </Modal>
          {generosFiltrados
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((genero: Genero) => {
              return (
                <div className="generoInfo" key={genero.id}>
                  <span
                    className="generoNome"
                    onClick={() => showModal(genero)}
                    style={{ color: "#3636ff", cursor: "pointer" }}
                  >
                    {genero.name}
                  </span>
                  <span className="generoCanais">{genero.channels.length}</span>
                  <span className="generoCanais">{genero.films.length}</span>
                  <span className="generoData">
                    {new Date(genero.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
