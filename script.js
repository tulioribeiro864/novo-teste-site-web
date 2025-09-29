// ============================
// Verificar login no site
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const linkLogin = document.getElementById("link-login");
  const linkCadastro = document.getElementById("link-cadastro");
  const linkPerfil = document.getElementById("link-perfil");
  const linkSair = document.getElementById("link-sair");

  if (usuarioLogado) {
    if (linkLogin) linkLogin.style.display = "none";
    if (linkCadastro) linkCadastro.style.display = "none";
    if (linkPerfil) linkPerfil.style.display = "inline-block";
    if (linkSair) linkSair.style.display = "inline-block";

    // Personalizar perfil
    const nomeUsuario = document.getElementById("nome-usuario");
    if (nomeUsuario) {
      nomeUsuario.textContent = `Bem-vindo, ${usuarioLogado.nome}!`;
    }
  }

  // Botão sair
  if (linkSair) {
    linkSair.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "index.html";
    });
  }
});

// ============================
// Cadastro
// ============================
const formCadastro = document.getElementById("form-cadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("cadastro-nome").value;
    const email = document.getElementById("cadastro-email").value;
    const senha = document.getElementById("cadastro-senha").value;
    const tipo = document.getElementById("cadastro-tipo").value;

    // salvar no localStorage
    const usuario = { nome, email, senha, tipo };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    window.location.href = "index.html";
  });
}

// ============================
// Login
// ============================
const formLogin = document.getElementById("form-login");
if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.email === email && usuario.senha === senha) {
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      window.location.href = "index.html";
    } else {
      alert("E-mail ou senha incorretos!");
    }
  });
}
