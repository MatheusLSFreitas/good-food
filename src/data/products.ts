import hamburgerImg from "@/assets/hamburger.jpg";
import pizzaImg from "@/assets/pizza.jpg";
import paoDeQueijoImg from "@/assets/pao-de-queijo.jpg";
import sucoLaranjaImg from "@/assets/suco-laranja.jpg";
import refrigeranteImg from "@/assets/refrigerante.jpg";
import { Product } from "@/types/order";

export const products: Product[] = [
  {
    id: "hamburger",
    name: "Hambúrguer Clássico",
    description: "Pão brioche, carne 150g, queijo prato e maionese especial",
    price: 15.0,
    image: hamburgerImg,
  },
  {
    id: "pizza",
    name: "Pizza de Calabresa (Fatia)",
    description: "Massa artesanal, molho de tomate, muçarela e calabresa fatiada",
    price: 10.0,
    image: pizzaImg,
  },
  {
    id: "pao-de-queijo",
    name: "Pão de Queijo",
    description: "Unidade grande, crocante por fora e macia por dentro",
    price: 5.0,
    image: paoDeQueijoImg,
  },
  {
    id: "suco-laranja",
    name: "Suco de Laranja 500ml",
    description: "Natural, gelado e sem conservantes",
    price: 7.0,
    image: sucoLaranjaImg,
  },
  {
    id: "refrigerante",
    name: "Refrigerante Lata",
    description: "Diversas opções (350ml)",
    price: 6.0,
    image: refrigeranteImg,
  },
];
