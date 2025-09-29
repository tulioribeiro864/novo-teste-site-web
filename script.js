const adminEmails = [
  "trn@aluno.ifnmg.edu.br",
  "vlap@aluno.ifnmg.edu.br",
  "jpgs2@aluno.ifnmg.edu.br",
  "lpo2@aluno.ifnmg.edu.br",
  "mjfb@aluno.ifnmg.edu.br",
  "hbf2@aluno.ifnmg.edu.br"
];

// Cadastro
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", e => {
    e.preventDefault();
    const nome = document.getElementById("cadastroNome").value;
    const email = document.getElementById("cadastroEmail").value;
    const senha = document.getElementById("cadastroSenha").value;

    localStorage.setItem("user", JSON.stringify({ nome, email, senha }));

    if (adminEmails.includes(email)) {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginPassword").value;
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email && user.senha === senha) {
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

// Perfil
const perfilNome = document.getElementById("perfilNome");
const perfilEmail = document.getElementById("perfilEmail");
if (perfilNome && perfilEmail) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    perfilNome.textContent = user.nome;
    perfilEmail.textContent = user.email;
  }
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    }
  });
}
