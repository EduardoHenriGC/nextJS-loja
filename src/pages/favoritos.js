import styles from "../styles/fav.module.css";
import { BsFillCartCheckFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import api from "@/Data/api";
import { useCallback, useState } from "react";
import Head from "next/head";
import { toast } from "react-toastify";

async function handleDeleteFavorite(itemID, setFavs) {
  try {
    await api.delete(`/fav${itemID}`);
    toast.warn("Produto removido dos favoritos");
    // Atualiza o estado dos favoritos após a remoção
    setFavs((prevFavs) => prevFavs.filter((fav) => fav.id !== itemID));
  } catch (error) {
    console.error("Falha ao remover favorito:", error);
  }
}

async function handleAddToCart(itemID, userEmail) {
  try {
    await api.post("/cart", {
      email: userEmail,
      produtoId: itemID,
    });
    toast.success("Produto adicionado ao carrinho");
  } catch (error) {
    console.error("Falha ao adicionar ao carrinho:", error);
  }
}

export default function Favoritos({ favs: initialFavs }) {
  const { data: session } = useSession();
  const [favs, setFavs] = useState(initialFavs);

  const handleDelete = useCallback(
    (itemID) => {
      handleDeleteFavorite(itemID, setFavs);
    },
    [setFavs]
  );
  const handleCart = useCallback(() => {
    handleAddToCart(itemID, session?.user.email);
  }, [session]);

  return (
    <>
      <Head>
        <title>Página dos Favoritos</title>
      </Head>
      <h2 className={styles.title}>Lista de favoritos</h2>
      <ul className={styles.jogoslist}>
        {favs.map(({ id, nome, imgurl, preco }) => (
          <li key={id}>
            <h4>{nome} </h4>
            <img src={imgurl} height="240px" width="200px" />
            <div className={styles.container_preco}>
              <p> ${preco} </p>
              <div>
                <BsFillCartCheckFill
                  className={styles.icons_cart}
                  onClick={() => {
                    handleCart(id);
                  }}
                />
                <AiFillDelete
                  className={styles.icons_thash}
                  onClick={() => {
                    handleDelete(id);
                  }}
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

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userEmail = session?.user.email;

  try {
    const res = await api.get("http://localhost:8800/fav", {
      params: { q: userEmail },
    });
    const favs = await res.data;

    return {
      props: { favs },
    };
  } catch (error) {
    console.error("Falha ao carregar favoritos:", error);
    return {
      props: { favs: [] },
    };
  }
}
