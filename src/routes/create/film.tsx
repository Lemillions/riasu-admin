import "../../styles/film.css";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { Input, message, Select } from "antd";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

interface Filme {
  id: string;
  name: string;
  description?: string;
  src: string;
  banner: string;
  genres: string[];
  createdAt: string;
}
export default function FilmCreate() {
  const [listaGeneros, setListaGeneros] = useState<any[]>([]);
  const [form, setForm] = useState<Filme>({
    id: "",
    name: "",
    description: "",
    src: "",
    banner: "",
    genres: [],
    createdAt: "",
  });

  useEffect(() => {
    api
      .get("genre")
      .then((res) => setListaGeneros(res.data))
      .catch((err) =>
        message.error(
          "Ocorreu um erro e não vai ser possivel selecionar os generos!"
        )
      );
  });

  const criarFilme = () => {
    if(form.name.length && form.src.length && form.banner.length ){
    api
      .post("film", {
        name: form.name,
        description: form.description,
        src: form.src,
        banner: form.banner,
      })
      .then((res) => {
        message.success("Filme criado com sucesso!");
        api
          .post(`film/${res.data.id}/genre`, form.genres)
          .catch((err) =>
            message.error("Ocorreu um erro ao adicionar generos!")
          );

        setForm({
          id: "",
          name: "",
          description: "",
          src: "",
          banner: "",
          genres: [],
          createdAt: "",
        });
      })
      .catch((err) => message.error("Ocorreu um erro ao criar o filme!"));
    }else{
      message.error("Preencha todos os campos obrigatórios!");
    }
  };

  const navigate = useNavigate();

  return (
    <div id="filmContainer">
      <header>
        <BiArrowBack
          size={26}
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        <h1>Filmes</h1>
      </header>
      <div id="formContainer">
        <label>* Nome :</label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <label>Descrição :</label>
        <Input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label>* Link do filme :</label>
        <Input
          value={form.src}
          onChange={(e) => setForm({ ...form, src: e.target.value })}
        />
        <label>* Link da imagem :</label>
        <Input
          value={form.banner}
          onChange={(e) => setForm({ ...form, banner: e.target.value })}
        />
        <label>Generos :</label>
        <Select
          mode="multiple"
          value={form.genres}
          onChange={(e) => setForm({ ...form, genres: e })}
          style={{ width: "100%" }}
          options={listaGeneros.map((genero) => ({
            label: genero.name,
            value: genero.id,
          }))}
        />
        <button onClick={criarFilme}>Criar filme</button>
      </div>
    </div>
  );
}
