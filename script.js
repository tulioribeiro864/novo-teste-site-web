const adminEmails = [
  "trn@aluno.ifnmg.edu.br",
  "vlap@aluno.ifnmg.edu.br",
  "jpgs2@aluno.ifnmg.edu.br",
  "lpo2@aluno.ifnmg.edu.br",
  "mjfb@aluno.ifnmg.edu.br",
  "hbf2@aluno.ifnmg.edu.br"
];


function atualizarMenu() {
  const menu = document.getElementById("menuLinks");
  if (!menu) return;
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    menu.innerHTML = `
      <a href="index.html">Home</a>
      <a href="perfil.html">Perfil</a>
      <a href="#" id="logoutMenu">Sair</a>
    `;

    document.getElementById("logoutMenu").addEventListener("click", () => {
      if (confirm("Tem certeza que deseja sair?")) {
        localStorage.removeItem("user");
        window.location.href = "index.html";
      }
    });
  }
}
atualizarMenu();


const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", e => {
    e.preventDefault();
    const nome = document.getElementById("cadastroNome").value;
    const email = document.getElementById("cadastroEmail").value;
    const senha = document.getElementById("cadastroSenha").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push({ nome, email, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("user", JSON.stringify({ nome, email, senha }));

    if (adminEmails.includes(email)) {
      window.location.href = "admin.html";
    } else {
      window.location.href = "perfil.html";
    }
  });
}


const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginPassword").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (adminEmails.includes(email)) {
        window.location.href = "admin.html";
      } else {
        window.location.href = "perfil.html";
      }
    } else {
      alert("Usuário ou senha inválidos!");
    }
  });
}


const perfilNome = document.getElementById("perfilNome");
const perfilEmail = document.getElementById("perfilEmail");
if (perfilNome && perfilEmail) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    perfilNome.textContent = user.nome;
    perfilEmail.textContent = user.email;
  } else {
    window.location.href = "login.html";
  }
}


const tabelaUsuarios = document.querySelector("#tabelaUsuarios tbody");
if (tabelaUsuarios) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  tabelaUsuarios.innerHTML = "";
  usuarios.forEach((u, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.nome}</td>
      <td>${u.email}</td>
      <td><button class="btn-prisma" onclick="removerUsuario(${index})">Remover</button></td>
    `;
    tabelaUsuarios.appendChild(tr);
  });
}

function removerUsuario(index) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios.splice(index, 1);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  window.location.reload();
}


const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    }
  });
  }
  /* ==================== Postar Serviço ==================== */
const servicoForm = document.getElementById("servicoForm");
if (servicoForm) {
  servicoForm.addEventListener("submit", e => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Você precisa estar logado para postar um serviço.");
      window.location.href = "login.html";
      return;
    }

    const nomeServico = document.getElementById("servicoNome").value;
    const descricao = document.getElementById("servicoDescricao").value;
    const contato = document.getElementById("servicoContato").value;

    // Processar imagens em Base64
    const imagensInput = document.getElementById("servicoImagem").files;
    let imagens = [];
    if (imagensInput.length > 0) {
      for (let i = 0; i < imagensInput.length; i++) {
        const reader = new FileReader();
        reader.onload = function(event) {
          imagens.push(event.target.result);

          if (i === imagensInput.length - 1) {
            salvarServico();
          }
        };
        reader.readAsDataURL(imagensInput[i]);
      }
    } else {
      salvarServico();
    }

    function salvarServico() {
      let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
      servicos.push({
        nomeServico,
        descricao,
        contato,
        imagens,
        usuario: user.nome
      });
      localStorage.setItem("servicos", JSON.stringify(servicos));
      alert("Serviço postado com sucesso!");
      window.location.href = "index.html";
    }
  });
}

/* ==================== Exibir Serviços na Home ==================== */
const servicosContainer = document.getElementById("servicosUsuarios");
if (servicosContainer) {
  let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
  if (servicos.length === 0) {
    servicosContainer.innerHTML = "<p>Nenhum serviço postado ainda.</p>";
  } else {
    servicos.forEach(servico => {
      const card = document.createElement("div");
      card.classList.add("card");

      let imagensHTML = "";
      if (servico.imagens && servico.imagens.length > 0) {
        imagensHTML = servico.imagens.map(img => `<img src="${img}" alt="Imagem do serviço" style="width:100%; border-radius:8px; margin:5px 0;">`).join("");
      }

      card.innerHTML = `
        <h3>${servico.nomeServico}</h3>
        <p><strong>Postado por:</strong> ${servico.usuario}</p>
        <p>${servico.descricao}</p>
        ${imagensHTML}
        <p><strong>Contato:</strong> ${servico.contato}</p>
      `;
      servicosContainer.appendChild(card);
    });
  }
}

