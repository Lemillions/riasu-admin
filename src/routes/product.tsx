import "../styles/product.css";
import { Input, Modal, Tooltip, Select, message } from "antd";
import { MdOutlineAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

interface Produto {
  id: string;
  name: string;
  channels: any[];
  createdAt: string;
}
export default function Product() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [buscaInput, setBuscaInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [listaCanais, setListaCanais] = useState<any[]>([]);
  const [form, setForm] = useState<Produto>({
    id: "",
    name: "",
    channels: [],
    createdAt: "",
  });

  useEffect(() => {
    api
      .get("product")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.log(err));

    api
      .get("channel")
      .then((res) => setListaCanais(res.data))
      .catch((err) =>
        message.error(
          "Ocorreu um erro e não vai ser possivel selecionar os canais"
        )
      );
  }, []);
  const navigate = useNavigate();
  const produtosFiltrados = buscaInput.length
    ? produtos.filter((e) =>
        e.name.toUpperCase().includes(buscaInput.toUpperCase())
      )
    : produtos;

  const showModal = (product: Produto) => {
    setForm({...product, channels: product.channels.map(channel => {return channel.channelId})})
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div id="productContainer">
      <header>
        <h1>Produtos</h1>
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
          <button onClick={() => navigate("/user/create")}>
            <MdOutlineAdd size={16} color="#fff" />
            Criar Produto
          </button>
        </div>
        <div id="listaProdutos">
          <div id="headerLista">
            <span className="produtoNome">Nome</span>
            <span className="produtoUsuarios">Quant. Usuarios</span>
            <span className="produtoCanais">Quant. Canais</span>
            <span className="produtoData">Data de criação</span>
          </div>
          <Modal
            title="Atualizar produto"
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
            <label>Canais :</label>
            <Select
              mode="multiple"
              placeholder="Selecione os planos"
              style={{ width: "100%" }}
              value={form.channels.map((e:any) => e)}
              onChange={(e) => setForm({ ...form, channels: e })}
              options={listaCanais.map((canal) => {
                return { label: canal.name, value: canal.id };
              })}
            />
          </Modal>
          {produtosFiltrados
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((produto: any) => {
              return (
                <div className="produtoInfo">
                  <span
                    className="produtoNome"
                    onClick={() => showModal(produto)}
                    style={{ color: "#3636ff", cursor: "pointer" }}
                  >
                    {produto.name}
                  </span>
                  <span className="produtoUsuarios">{produto.users.length}</span>
                  <span className="produtoCanais">
                    {produto.channels.length}
                  </span>
                  <span className="produtoData">
                    {new Date(produto.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
