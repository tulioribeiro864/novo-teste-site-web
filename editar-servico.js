const user = JSON.parse(localStorage.getItem("user"));
if(!user) window.location.href="login.html";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href="index.html";
});

const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get("id"));
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let servico = servicos.find(s => s.id === id && s.criadoPor === user.email);
if(!servico) window.location.href="perfil.html";

document.getElementById("editarNome").value = servico.nomeServico || servico.titulo || "";
document.getElementById("editarDescricao").value = servico.descricao;
document.getElementById("editarContato").value = servico.contato;

document.getElementById("editarServicoForm").addEventListener("submit", e => {
  e.preventDefault();
  const novoNome = document.getElementById("editarNome").value;
  const novaDescricao = document.getElementById("editarDescricao").value;
  const novoContato = document.getElementById("editarContato").value;
  const inputImagens = document.getElementById("editarImagens").files;

  if(inputImagens.length > 0){
    let imagens = [];
    let count = 0;
    for(let i=0;i<inputImagens.length;i++){
      const reader = new FileReader();
      reader.onload = function(event){
        imagens.push(event.target.result);
        count++;
        if(count === inputImagens.length){
          salvar(imagens);
        }
      }
      reader.readAsDataURL(inputImagens[i]);
    }
  } else {
    salvar(servico.imagens || []);
  }

  function salvar(imagens){
    servico.nomeServico = novoNome;
    servico.titulo = novoNome;
    servico.descricao = novaDescricao;
    servico.contato = novoContato;
    servico.imagens = imagens;
    localStorage.setItem("servicos", JSON.stringify(servicos));
    alert("Serviço atualizado com sucesso!");
    window.location.href="perfil.html";
  }
});
