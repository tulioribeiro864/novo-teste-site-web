let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const servico = servicos.find(s => s.id == id);

if(!servico){
  alert("Serviço não encontrado!");
  window.location.href = "perfil.html";
}

// Preencher campos
document.getElementById("tituloServico").value = servico.titulo;
document.getElementById("descricaoServico").value = servico.descricao;

// Salvar alterações
document.getElementById("formEditarServico").addEventListener("submit", (e) => {
  e.preventDefault();
  servico.titulo = document.getElementById("tituloServico").value;
  servico.descricao = document.getElementById("descricaoServico").value;

  localStorage.setItem("servicos", JSON.stringify(servicos));
  alert("Serviço atualizado com sucesso!");
  window.location.href = "perfil.html";
});
