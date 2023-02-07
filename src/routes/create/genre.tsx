import "../../styles/genre.css";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { Input, message, Select } from "antd";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

interface Genero {
  name: string;
  channels: any[];
  films: any[];
}

export default function GenreCreate() {
  const [listaCanais, setListaCanais] = useState<any[]>([]);
  const [listaFilmes, setListaFilmes] = useState<any[]>([]);
  const [form, setForm] = useState<Genero>({
    name: "",
    channels: [],
    films: [],
  });

  useEffect(() => {
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

  const criarGenero = () => {
    console.log(form)
    if (form.name.length) {
      api.post("genre", { name: form.name }).then((res) => {
        message.success("Genero criado com sucesso!");

        api
          .post(`genre/${res.data.id}/film`, form.films)
          .catch((err) =>
            message.error("Ocorreu um erro ao adicionar filmes!")
          );

        api
          .post(`genre/${res.data.id}/channel`, form.channels)
          .catch((err) =>
            message.error("Ocorreu um erro ao adicionar canais!")
          );

          setForm({
            name: "",
            channels: [],
            films: [],
          });
      });
    } else {
      message.error("Preencha o nome do genero!");
    }
  };
  const navigate = useNavigate();
  return (
    <div id="genreContainer">
      <header>
        <BiArrowBack
          size={26}
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        <h1>Generos</h1>
      </header>
      <div id="formContainer">
        <label>* Nome :</label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
        />
        <label>Canais :</label>
        <Select
          mode="multiple"
          placeholder="Selecione os generos"
          value={form.channels}
          onChange={(e) => setForm({ ...form, channels: e })}
          options={listaCanais.map((canal) => {
            return { label: canal.name, value: canal.id };
          })}
        />
        <label>Filmes :</label>
        <Select
          mode="multiple"
          placeholder="Selecione os filmes"
          value={form.films}
          onChange={(e) => setForm({ ...form, films: e })}
          options={listaFilmes.map((filme) => {
            return { label: filme.name, value: filme.id };
          })}
        />
        <button
          style={{ width: "140px", marginTop: "20px" }}
          onClick={() => {
            criarGenero();
          }}
        >
          Criar genero
        </button>
      </div>
    </div>
  );
}
