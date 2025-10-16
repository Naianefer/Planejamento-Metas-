// === Selecionando elementos ===
const form = document.getElementById("form-meta");
const tituloInput = document.getElementById("titulo");
const categoriaSelect = document.getElementById("categoria");
const prazoInput = document.getElementById("prazo");
const prioridadeSelect = document.getElementById("prioridade");
const lista = document.getElementById("metas-lista");
const buscarInput = document.getElementById("buscar");
const filtroCategoria = document.getElementById("filtro-categoria");

// === Função para retornar ícone da categoria ===
function iconeCategoria(categoria) {
  switch(categoria) {
    case "Pessoal": return "❤️";
    case "Profissional": return "💼";
    case "Financeira": return "💰";
    case "Aprendizado": return "📚";
    default: return "🔖";
  }
}

// === Carregar metas do localStorage ===
let metas = JSON.parse(localStorage.getItem("metas")) || [];

// === Função para salvar no localStorage ===
function salvarMetas() {
  localStorage.setItem("metas", JSON.stringify(metas));
}

// === Adicionar meta ===
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = tituloInput.value.trim();
  const categoria = categoriaSelect.value;
  const prazo = prazoInput.value;
  const prioridade = prioridadeSelect.value;

  if (!titulo) return alert("Por favor, digite uma meta!");

  const novaMeta = {
    id: Date.now(),
    titulo,
    categoria,
    prazo,
    prioridade,
    concluida: false,
  };

  metas.push(novaMeta);
  salvarMetas();
  renderMetas();
  form.reset();
});

// === Renderizar metas ===
function renderMetas() {
  lista.innerHTML = "";

  const termoBusca = buscarInput.value.toLowerCase();
  const filtro = filtroCategoria.value;

  const metasFiltradas = metas.filter((meta) => {
    const buscaOk = meta.titulo.toLowerCase().includes(termoBusca);
    const categoriaOk = filtro ? meta.categoria === filtro : true;
    return buscaOk && categoriaOk;
  });

  if (metasFiltradas.length === 0) {
    lista.innerHTML = "<p style='text-align:center;'>Nenhuma meta encontrada 😅</p>";
    return;
  }

  metasFiltradas.forEach((meta) => {
    const li = document.createElement("li");
    li.classList.add("meta-item");

    // Adiciona classe conforme prioridade
    if (meta.prioridade === "Alta") li.classList.add("prioridade-alta");
    else if (meta.prioridade === "Média") li.classList.add("prioridade-media");
    else if (meta.prioridade === "Baixa") li.classList.add("prioridade-baixa");

    if (meta.concluida) li.classList.add("concluida");

    const texto = document.createElement("div");
    texto.classList.add("meta-texto");
    texto.innerHTML = `
      <strong>${meta.titulo}</strong><br>
      <small>
        ${
          meta.categoria
            ? `<span class="categoria-tag categoria-${meta.categoria.toLowerCase()}">
                ${iconeCategoria(meta.categoria)} ${meta.categoria}
              </span>`
            : `<span class="categoria-tag">Sem categoria</span>`
        }
        | <span class="prioridade-texto">${meta.prioridade || "Sem prioridade"}</span> |
        ${meta.prazo ? meta.prazo.split("-").reverse().join("/") : "Sem prazo"}
      </small>
    `;

    const botoes = document.createElement("div");
    botoes.classList.add("botoes");

    const btnConcluir = document.createElement("button");
    btnConcluir.innerHTML = "✅";
    btnConcluir.title = "Concluir";
    btnConcluir.onclick = () => {
      meta.concluida = !meta.concluida;
      salvarMetas();
      renderMetas();
    };

    const btnEditar = document.createElement("button");
    btnEditar.innerHTML = "✏️";
    btnEditar.title = "Editar";
    btnEditar.onclick = () => editarMeta(meta.id);

    const btnExcluir = document.createElement("button");
    btnExcluir.innerHTML = "🗑️";
    btnExcluir.title = "Excluir";
    btnExcluir.onclick = () => {
      if (confirm("Tem certeza que deseja excluir esta meta?")) {
        metas = metas.filter((m) => m.id !== meta.id);
        salvarMetas();
        renderMetas();
      }
    };

    botoes.append(btnConcluir, btnEditar, btnExcluir);
    li.append(texto, botoes);
    lista.appendChild(li);
  });
}

// === Editar meta ===
function editarMeta(id) {
  const meta = metas.find((m) => m.id === id);
  if (!meta) return;

  const novoTitulo = prompt("Edite sua meta:", meta.titulo);
  if (novoTitulo === null || novoTitulo.trim() === "") return;

  meta.titulo = novoTitulo.trim();
  salvarMetas();
  renderMetas();
}

// === Filtros e busca ===
buscarInput.addEventListener("input", renderMetas);
filtroCategoria.addEventListener("change", renderMetas);

// === Inicialização ===
renderMetas();
