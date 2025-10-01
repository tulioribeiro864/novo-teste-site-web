// Seleciona os elementos
const heroTextTitle = document.querySelectorAll(".hero_text_title li span");

// Cria uma timeline do GSAP
let heroSectionTL = gsap.timeline();

// Animação do título
heroSectionTL.from(heroTextTitle, {
  duration: 1.2,
  opacity: 0,
  y: 100,
  ease: "power4.out",
  stagger: 0.2
});

// Animação dos botões
heroSectionTL.from(".btn", {
  duration: 1,
  opacity: 0,
  scale: 0.5,
  ease: "back.out(1.7)",
  stagger: 0.3
}, "-=0.8");

// Animação da imagem
heroSectionTL.from(".hero_image img", {
  duration: 1.5,
  opacity: 0,
  scale: 0.7,
  ease: "elastic.out(1, 0.5)"
}, "-=1");
