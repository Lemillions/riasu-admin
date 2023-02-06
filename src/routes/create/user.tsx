import "../../styles/user.css";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { Input, message, Select } from "antd";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

interface Usuario {
  name: string;
  username: string;
  email: string;
  password: string;
  status: string;
  products: string[];
}

export default function UserCreate() {
  const [listaProdutos, setListaProdutos] = useState<any[]>([]);
  const [form, setForm] = useState<Usuario>({
    name: "",
    username: "",
    email: "",
    password: "",
    status: "ACTIVE",
    products: [],
  });
  const navigate = useNavigate();
  useEffect(() => {
    api
      .get("product")
      .then((res) => setListaProdutos(res.data))
      .catch((err) =>
        message.error(
          "Ocorreu um erro e não vai ser possivel selecionar os planos"
        )
      );
  }, []);
  const criarUsuario = () => {
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (
      form.name.length &&
      form.username.length &&
      regexEmail.test(form.email) &&
      form.password.length
    ) {
      api
        .post("user", {
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
          status: form.status,
        })
        .then((res) => {
          message.success("Usuario criado com sucesso");
          api
            .post(`user/${res.data.id}/product`, form.products)
            .catch((err) => {
              message.error("Ocorreu um erro ao adicionar planos");
            });
        })
        .catch((err) => message.error("Ocorreu um erro ao criar usuario!"));

      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        status: "ACTIVE",
        products: [],
      });
    } else {
      message.error("Preencha todos os campos corretamente!");
    }
  };

  return (
    <div id="userContainer">
      <header>
        <BiArrowBack
          size={26}
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        <h1>Usuários</h1>
      </header>
      <div id="formContainer">
        <label>* Nome :</label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
        />
        <label>* Username :</label>
        <Input
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.currentTarget.value })
          }
        />
        <label>* Email :</label>
        <Input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
        />
        <div>
          <label>* Senha :</label>
          <Input
            value={form.password}
            style={{ width: "400px" }}
            onChange={(e) =>
              setForm({ ...form, password: e.currentTarget.value })
            }
          />
          <label>* Status :</label>
          <Select
            defaultValue="ACTIVE"
            onChange={(e) => setForm({ ...form, status: e })}
            style={{
              width: 120,
              marginLeft: "5px",
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
          value={form.products}
          onChange={(e) => setForm({ ...form, products: e })}
          options={listaProdutos.map((produto) => {
            return { label: produto.name, value: produto.id };
          })}
        />
        <button
          style={{ width: "140px", marginTop: "20px" }}
          onClick={() => {
            criarUsuario();
          }}
        >
          Criar usuário
        </button>
      </div>
    </div>
  );
}
