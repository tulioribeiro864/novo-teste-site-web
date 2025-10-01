// Lista de administradores
const adminEmails = [
  "trn@aluno.ifnmg.edu.br",
  "vlap@aluno.ifnmg.edu.br",
  "jpgs2@aluno.ifnmg.edu.br",
  "lpo2@aluno.ifnmg.edu.br",
  "mjfb@aluno.ifnmg.edu.br",
  "hbf2@aluno.ifnmg.edu.br"
];

// Ativar transição de entrada
window.addEventListener("load", () => {
  document.body.classList.add("loaded");

  // animação nos links do menu
  gsap.from("header nav a", {
    y: -20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "back.out(1.7)"
  });
});

// Animações ao clicar nos links da navbar
const navLinks = document.querySelectorAll("nav a");
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const destino = link.getAttribute("href");

    gsap.to("body", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        window.location.href = destino;
      }
    });
  });
});

/* ================== Lógica de Login/Cadastro ================== */
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
