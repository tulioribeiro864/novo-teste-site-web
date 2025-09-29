// Exemplo simples de alerta ao reservar serviço
document.addEventListener("DOMContentLoaded", () => {
  const botoes = document.querySelectorAll(".card .btn");
  botoes.forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Serviço reservado com sucesso!");
    });
  });
});
