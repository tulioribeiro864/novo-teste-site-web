const user = JSON.parse(localStorage.getItem("user"));
const menu = document.getElementById("menuLinks");

if(menu && user){
  menu.innerHTML = `<a href="index.html">Home</a><a href="perfil.html">Perfil</a><a href="#" id="logoutMenu">Sair</a>`;
  document.getElementById("logoutMenu").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href="index.html";
  });
}

if(!user) window.location.href="login.html";

const perfilNome = document.getElementById("perfilNome");
const perfilEmail = document.getElementById("perfilEmail");
if(perfilNome && perfilEmail){
  perfilNome.textContent = user.nome;
  perfilEmail.textContent = user.email;
}

const logoutBtns = [document.getElementById("logoutBtn"), document.getElementById("logoutPerfil")];
logoutBtns.forEach(btn => {
  if(btn) btn.addEventListener("click", ()=>{
    localStorage.removeItem("user");
    window.location.href="index.html";
  });
});

const meusServicosContainer = document.getElementById("meusServicos");
const reservadosContainer = document.getElementById("servicosReservados");

let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let reservas = JSON.parse(localStorage.getItem("reservas")) || {};

// Serviços criados pelo usuário
if(meusServicosContainer){
  let meus = servicos.filter(s=>s.criadoPor===user.email);
  if(meus.length===0) meusServicosContainer.innerHTML="<p>Você ainda não criou nenhum serviço.</p>";
  else meus.forEach((s,i)=>{
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `<h3>${s.nome}</h3><p>${s.descricao}</p><p><b>Contato:</b> ${s.contato}</p><button onclick="editarServico(${i})">Editar</button>`;
    meusServicosContainer.appendChild(card);
  });
}

// Serviços reservados pelo usuário
if(reservadosContainer){
  let meusReservados = reservas[user.email] || [];
  if(meusReservados.length===0) reservadosContainer.innerHTML="<p>Você ainda não reservou nenhum serviço.</p>";
  else meusReservados.forEach(s=>{
    const card = document.createElement("div");
    card.classList.add("card");
    const imgHTML = s.imagens && s.imagens[0] ? `<img src="${s.imagens[0]}" style="width:100%;border-radius:8px;margin:5px 0;">`:"";
    card.innerHTML = `${imgHTML}<p><b>Serviço:</b> ${s.nome}</p><p>${s.descricao}</p><p><b>Contato:</b> ${s.contato}</p>`;
    reservadosContainer.appendChild(card);
  });
}

function editarServico(index){
  let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
  let s = servicos[index];
  let novoNome = prompt("Novo nome:", s.nome);
  let novaDesc = prompt("Nova descrição:", s.descricao);
  let novoContato = prompt("Novo contato:", s.contato);
  servicos[index] = {...s, nome: novoNome||s.nome, descricao: novaDesc||s.descricao, contato: novoContato||s.contato};
  localStorage.setItem("servicos", JSON.stringify(servicos));
  window.location.reload();
}
