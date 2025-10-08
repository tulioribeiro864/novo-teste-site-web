const adminEmails = ["trn@aluno.ifnmg.edu.br","vlap@aluno.ifnmg.edu.br","jgps2@aluno.ifnmg.edu.br","lpo2@aluno.ifnmg.edu.br","mjfb@aluno.ifnmg.edu.br","hbf2@aluno.ifnmg.edu.br"];
let user = JSON.parse(localStorage.getItem("user"));

const menu = document.getElementById("menuLinks");
if(menu){
  if(user){
    menu.innerHTML = `<a href="index.html">Home</a><a href="perfil.html">Perfil</a><a href="#" id="logoutMenu">Sair</a>`;
    document.getElementById("logoutMenu").addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href="index.html";
    });
  } else {
    menu.innerHTML = `<a href="index.html">Home</a><a href="login.html">Login</a><a href="cadastro.html">Cadastro</a>`;
  }
}

const heroSection = document.querySelector(".hero .botoes-hero");
if(user && adminEmails.includes(user.email)){
  const adminBtn = document.createElement("button");
  adminBtn.textContent = "Painel Admin";
  adminBtn.className = "btn-prisma";
  adminBtn.onclick = ()=> window.location.href="admin.html";
  heroSection.appendChild(adminBtn);
}

const cadastroForm = document.getElementById("cadastroForm");
if(cadastroForm){
  cadastroForm.addEventListener("submit", e=>{
    e.preventDefault();
    const nome = document.getElementById("cadastroNome").value;
    const email = document.getElementById("cadastroEmail").value;
    const senha = document.getElementById("cadastroSenha").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios"))||[];
    if(usuarios.some(u=>u.email===email)){ alert("Email já cadastrado!"); return; }
    const novoUsuario = {nome,email,senha};
    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("user", JSON.stringify(novoUsuario));
    window.location.href = adminEmails.includes(email)?"admin.html":"perfil.html";
  });
}

const loginForm = document.getElementById("loginForm");
if(loginForm){
  loginForm.addEventListener("submit", e=>{
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginPassword").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios"))||[];
    const userFound = usuarios.find(u=>u.email===email&&u.senha===senha);
    if(userFound){ 
      localStorage.setItem("user", JSON.stringify(userFound));
      user = userFound;
      window.location.href = adminEmails.includes(email)?"admin.html":"perfil.html"; 
    } else alert("Usuário ou senha inválidos!");
  });
}

const perfilNome = document.getElementById("perfilNome");
const perfilEmail = document.getElementById("perfilEmail");
if(perfilNome && perfilEmail){
  if(user){ perfilNome.textContent=user.nome; perfilEmail.textContent=user.email; }
  else window.location.href="login.html";
}

const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn) logoutBtn.addEventListener("click", ()=>{ localStorage.removeItem("user"); window.location.href="index.html"; });

const servicoForm = document.getElementById("servicoForm");
if(servicoForm){
  servicoForm.addEventListener("submit", e=>{
    e.preventDefault();
    if(!user){ alert("Você precisa estar logado!"); window.location.href="login.html"; return; }
    const nome = document.getElementById("servicoNome").value;
    const descricao = document.getElementById("servicoDescricao").value;
    const contato = document.getElementById("servicoContato").value;
    const imagensInput = document.getElementById("servicoImagem").files;
    let imagens = [];
    if(imagensInput.length>0){
      let count=0;
      for(let i=0;i<imagensInput.length;i++){
        const reader = new FileReader();
        reader.onload = e=>{ imagens.push(e.target.result); count++; if(count===imagensInput.length) salvarServico(); }
        reader.readAsDataURL(imagensInput[i]);
      }
    } else salvarServico();
    function salvarServico(){
      let servicos = JSON.parse(localStorage.getItem("servicos"))||[];
      servicos.push({nome,descricao,contato,imagens,criadoPor:user.nome});
      localStorage.setItem("servicos", JSON.stringify(servicos));
      window.location.href="index.html";
    }
  });
}

function renderizarServicos(){
  const container = document.getElementById("servicosUsuarios");
  if(!container) return;
  container.innerHTML="";
  let servicos = JSON.parse(localStorage.getItem("servicos"))||[];
  if(servicos.length===0){ container.innerHTML="<p>Nenhum serviço postado ainda.</p>"; return; }
  servicos.forEach((s,index)=>{
    const card=document.createElement("div");
    card.classList.add("card");
    let imgHTML = s.imagens.length>0?`<img src="${s.imagens[0]}" alt="Imagem do serviço">`:"";
    card.innerHTML = `<h3>${s.nome}</h3>${imgHTML}<p><b>Por:</b> ${s.criadoPor}</p><p><b>Contato:</b> ${s.contato}</p>`;
    if(user && s.criadoPor!==user.nome){
      const btn = document.createElement("button");
      btn.textContent="Reservar";
      btn.className="btn-prisma";
      btn.onclick = ()=> reservarServico(index);
      card.appendChild(btn);
    }
    container.appendChild(card);
  });
}
renderizarServicos();

function reservarServico(index){
  if(!user){ alert("Faça login para reservar!"); return; }
  let servicos = JSON.parse(localStorage.getItem("servicos"))||[];
  let servico = servicos[index];
  let reservas = JSON.parse(localStorage.getItem("reservas"))||{};
  if(!reservas[user.email]) reservas[user.email]=[];
  reservas[user.email].push(servico);
  localStorage.setItem("reservas", JSON.stringify(reservas));
  alert("Serviço reservado!");
  window.location.reload();
}

const meusServicosContainer = document.getElementById("meusServicos");
const servicosReservadosContainer = document.getElementById("servicosReservados");
if(meusServicosContainer && servicosReservadosContainer && user){
  const servicos = JSON.parse(localStorage.getItem("servicos"))||[];
  const reservas = JSON.parse(localStorage.getItem("reservas"))||{};
  const meus = servicos.filter(s=>s.criadoPor===user.nome);
  const minhasReservas = reservas[user.email]||[];

  meusServicosContainer.innerHTML="";
  if(meus.length===0) meusServicosContainer.innerHTML="<p>Você ainda não criou nenhum serviço.</p>";
  else meus.forEach((s,i)=>{
    const card=document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `<h3>${s.nome}</h3><p>${s.descricao}</p><p><b>Contato:</b> ${s.contato}</p><button onclick="editarServico(${i})">Editar</button>`;
    meusServicosContainer.appendChild(card);
  });

  servicosReservadosContainer.innerHTML="";
  if(minhasReservas.length===0) servicosReservadosContainer.innerHTML="<p>Você não reservou nenhum serviço ainda.</p>";
  else minhasReservas.forEach((s,i)=>{
    const card=document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `<h3>${s.nome}</h3><p>${s.descricao}</p><p><b>Contato:</b> ${s.contato}</p><button onclick="cancelarReserva(${i})" class="btn-danger">Cancelar Reserva</button>`;
    servicosReservadosContainer.appendChild(card);
  });
}

function cancelarReserva(index){
  let reservas = JSON.parse(localStorage.getItem("reservas"))||{};
  reservas[user.email].splice(index,1);
  localStorage.setItem("reservas", JSON.stringify(reservas));
  window.location.reload();
}

function editarServico(index){
  let servicos = JSON.parse(localStorage.getItem("servicos"))||[];
  let s = servicos[index];
  let novoNome = prompt("Novo nome:",s.nome);
  let novaDesc = prompt("Nova descrição:",s.descricao);
  let novoContato = prompt("Novo contato:",s.contato);
  servicos[index] = {...s,nome:novoNome||s.nome,descricao:novaDesc||s.descricao,contato:novoContato||s.contato};
  localStorage.setItem("servicos", JSON.stringify(servicos));
  window.location.reload();
}
const navToggle = document.getElementById("navToggle");
const sidebar = document.getElementById("sidebar");

if (navToggle && sidebar) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    if (sidebar.style.display === "flex") {
      sidebar.style.display = "none";
    } else {
      sidebar.style.display = "flex";
    }
  });
}

