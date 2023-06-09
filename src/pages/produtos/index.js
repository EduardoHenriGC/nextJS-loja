import styles from "../../styles/produtos.module.css";
import { FcLike } from "react-icons/fc";
import { BsFillCartCheckFill } from "react-icons/bs";
import Link from "next/link";
import { getSession } from "next-auth/react";
import api from "@/Data/api";
import { useCallback } from "react";
import { toast } from "react-toastify";
import Head from "next/head";

// API endpoint URL
const API_URL = "http://localhost:8800/produtos";

export async function getStaticProps() {
  // Fetch products data from the API
  const res = await fetch(API_URL);
  const todos = await res.json();

  return {
    props: { todos },
  };
}

// Function to handle the like button click
async function handleDelClick(itemID, setFavs) {
  try {
    await api
      .delete(`/fav${itemID}`)
      .then(() => toast.warn("produto removido dos favoritos"));
    // update favs state after deletion
    setFavs((prevFavs) => prevFavs.filter((fav) => fav.id !== itemID));
  } catch (error) {
    console.error("Failed to delete favorite:", error);
  }
}
async function handleLikeClick(productID, context) {
  const session = await getSession(context);
  const userEmail = session?.user.email;

  await api
    .post("/fav", {
      email: userEmail,
      produtoId: productID,
    })
    .then(() => toast.success("produto adicionado aos favoritos"));
}

async function handleCartClick(itemID, context) {
  const session = await getSession(context);
  const userEmail = session?.user.email;

  await api
    .post("/cart", {
      email: userEmail,
      produtoId: itemID,
    })
    .then(() => toast.success("produto adicionado ao carrinho"));
}

export default function Todos({ todos }) {
  // useCallback to memoize the function for better performance
  const handleLike = useCallback((productID) => {
    handleLikeClick(productID);
  }, []);

  const handleCart = useCallback((productID) => {
    handleCartClick(productID);
  }, []);

  return (
    <>
      <Head>
        <title>Pagina dos Produtos</title>
      </Head>

      <h2 className={styles.title}>Lista de produtos</h2>
      <ul className={styles.jogoslist}>
        {todos.map(({ id, nome, imgurl, preco }) => (
          <li key={id}>
            <h4>{nome}</h4>
            <img src={imgurl} alt={nome} height="300px" width="300px" />
            <div className={styles.container_preco}>
              <p>${preco}</p>
              <div>
                <BsFillCartCheckFill
                  className={styles.icons_cart}
                  onClick={() => handleCart(id)}
                />
                <FcLike
                  className={styles.icons_like}
                  onClick={() => handleLike(id)}
                />
              </div>
            </div>
            <Link className={styles.link} href={`/produtos/${id}`}>
              Ver mais..
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
