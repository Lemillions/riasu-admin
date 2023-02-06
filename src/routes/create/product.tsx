import "../../styles/product.css";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { Input, message, Select } from "antd";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

interface Produto {
  name: string;
  channels: any[];
}

export default function ProductCreate() {
  const [listaCanais, setListaCanais] = useState<any[]>([]);
  const [form, setForm] = useState<Produto>({
    name: "",
    channels: [],
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
  }, []);

  const criarProduto = () => {
    if (form.name.length) {
      api.post("product", { name: form.name }).then((res) => {
        message.success("Plano criado com sucesso!");
        api
          .post(`product/${res.data.id}/channel`, form.channels)
          .catch((err) =>
            message.error("Ocorreu um erro ao adicionar canais!")
          );
      });
      setForm({
        name: "",
        channels: [],
      });
    } else {
      message.error("Preencha o nome do plano!");
    }
  };
  const navigate = useNavigate();
  return (
    <div id="productContainer">
      <header>
        <BiArrowBack
          size={26}
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        <h1>Produtos</h1>
      </header>
      <div id="formContainer">
        <label>* Nome :</label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
        />
        <Select
          mode="multiple"
          placeholder="Selecione os planos"
          value={form.channels}
          onChange={(e) => setForm({ ...form, channels: e })}
          options={listaCanais.map((canal) => {
            return { label: canal.name, value: canal.id };
          })}
        />
        <button
          style={{ width: "140px", marginTop: "20px" }}
          onClick={() => {
            criarProduto();
          }}
        >
          Criar plano
        </button>
      </div>
    </div>
  );
}
