const adminEmails = ["trn@aluno.ifnmg.edu.br","vlap@aluno.ifnmg.edu.br","jpgs2@aluno.ifnmg.edu.br","lpo2@aluno.ifnmg.edu.br","mjfb@aluno.ifnmg.edu.br","hbf2@aluno.ifnmg.edu.br"];
const user = JSON.parse(localStorage.getItem("user"));

const menu = document.getElementById("menuLinks");
if(menu && user){
  menu.innerHTML = `<a href="index.html">Home</a><a href="perfil.html">Perfil</a><a href="#" id="logoutMenu">Sair</a>`;
  document.getElementById("logoutMenu").addEventListener("click", () => { localStorage.removeItem("user"); window.location.href = "index.html"; });
}

const cadastroForm = document.getElementById("cadastroForm");
if(cadastroForm){
  cadastroForm.addEventListener("submit", e => {
    e.preventDefault();
    const nome = document.getElementById("cadastroNome").value;
    const email = document.getElementById("cadastroEmail").value;
    const senha = document.getElementById("cadastroSenha").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
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
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginPassword").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const user = usuarios.find(u=>u.email===email&&u.senha===senha);
    if(user){ localStorage.setItem("user", JSON.stringify(user)); window.location.href = adminEmails.includes(email)?"admin.html":"perfil.html"; }
    else alert("Usuário ou senha inválidos!");
  });
}

const perfilNome = document.getElementById("perfilNome");
const perfilEmail = document.getElementById("perfilEmail");
if(perfilNome && perfilEmail){
  const user = JSON.parse(localStorage.getItem("user"));
  if(user){ perfilNome.textContent=user.nome; perfilEmail.textContent=user.email; }
  else window.location.href="login.html";
}

const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn) logoutBtn.addEventListener("click", ()=>{ localStorage.removeItem("user"); window.location.href="index.html"; });

const servicoForm = document.getElementById("servicoForm");
if(servicoForm){
  servicoForm.addEventListener("submit", e => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user){ alert("Você precisa estar logado!"); window.location.href="login.html"; return; }
    const nomeServico=document.getElementById("servicoNome").value;
    const descricao=document.getElementById("servicoDescricao").value;
    const contato=document.getElementById("servicoContato").value;
    const imagensInput=document.getElementById("servicoImagem").files;
    let imagens=[];
    if(imagensInput.length>0){
      let count=0;
      for(let i=0;i<imagensInput.length;i++){
        const reader=new FileReader();
        reader.onload=function(e){ imagens.push(e.target.result); count++; if(count===imagensInput.length) salvarServico(); }
        reader.readAsDataURL(imagensInput[i]);
      }
    } else salvarServico();
    function salvarServico(){
      let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
      servicos.push({ nome:nomeServico, descricao, contato, imagens, criadoPor:user.email });
      localStorage.setItem("servicos", JSON.stringify(servicos));
      window.location.href="index.html";
    }
  });
}

const servicosContainer=document.getElementById("servicosUsuarios");
if(servicosContainer){
  let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
  if(servicos.length===0) servicosContainer.innerHTML="<p>Nenhum serviço postado ainda.</p>";
  else servicos.forEach(s=>{
    const card=document.createElement("div");
    card.classList.add("card");
    let imagensHTML="";
    if(s.imagens&&s.imagens.length>0) imagensHTML=s.imagens.map(img=>`<img src="${img}" style="width:100%;border-radius:8px;margin:5px 0;">`).join("");
    card.innerHTML=`<h3>${s.nome}</h3><p><b>Postado por:</b> ${s.criadoPor}</p><p>${s.descricao}</p>${imagensHTML}<p><b>Contato:</b> ${s.contato}</p>`;
    servicosContainer.appendChild(card);
  });
}

const meusServicosContainer=document.getElementById("meusServicos");
if(meusServicosContainer && user){
  let servicos=JSON.parse(localStorage.getItem("servicos"))||[];
  let meus=servicos.filter(s=>s.criadoPor===user.email);
  if(meus.length===0) meusServicosContainer.innerHTML="<p>Você ainda não criou nenhum serviço.</p>";
  else meus.forEach((s,i)=>{
    const card=document.createElement("div");
    card.classList.add("card");
    card.innerHTML=`<h3>${s.nome}</h3><p>${s.descricao}</p><p><b>Contato:</b> ${s.contato}</p><button onclick="editarServico(${i})">Editar</button>`;
    meusServicosContainer.appendChild(card);
  });
}

function editarServico(index){
  let servicos=JSON.parse(localStorage.getItem("servicos"))||[];
  let s=servicos[index];
  let novoNome=prompt("Novo nome:",s.nome), novaDesc=prompt("Nova descrição:",s.descricao), novoContato=prompt("Novo contato:",s.contato);
  servicos[index]={...s,nome:novoNome||s.nome,descricao:novaDesc||s.descricao,contato:novoContato||s.contato};
  localStorage.setItem("servicos",JSON.stringify(servicos));
  window.location.reload();
}
