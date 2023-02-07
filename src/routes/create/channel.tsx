import "../../styles/channel.css";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { Input, message, Select } from "antd";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

interface Canal {
  id: string;
  name: string;
  description?: string;
  src: string;
  banner: string;
  genres: string[];
  createdAt: string;
}
export default function ChannelCreate() {
  const [listaGeneros, setListaGeneros] = useState<any[]>([]);
  const [form, setForm] = useState<Canal>({
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

  const criarCanal = () => {
    if(form.name.length && form.src.length && form.banner.length ){
    api
      .post("channel", {
        name: form.name,
        description: form.description,
        src: form.src,
        banner: form.banner,
      })
      .then((res) => {
        message.success("Canal criado com sucesso!");
        api
          .post(`channel/${res.data.id}/genre`, form.genres)
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
      .catch((err) => message.error("Ocorreu um erro ao criar o canal!"));
    }else{
      message.error("Preencha todos os campos obrigatórios!");
    }
  };

  const navigate = useNavigate();

  return (
    <div id="channelContainer">
      <header>
        <BiArrowBack
          size={26}
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        <h1>Canais</h1>
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
        <label>* Link do canal :</label>
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
        <button onClick={criarCanal}>Criar canal</button>
      </div>
    </div>
  );
}
