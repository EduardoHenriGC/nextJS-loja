import styles from '../../styles/produtos.module.css';
import { FcLike } from "react-icons/fc";
import { BsFillCartCheckFill } from "react-icons/bs";
import Link from 'next/link';
import { getSession } from "next-auth/react";
import api from '@/Data/api';
import { useCallback } from 'react';
import { toast } from "react-toastify";

// API endpoint URL
const API_URL = 'http://localhost:8800/produtos';

export async function getStaticProps() {
  // Fetch products data from the API
  const res = await fetch(API_URL);
  const todos = await res.json();

  return {
    props: { todos },
  };
}

// Function to handle the like button click
async function handleLikeClick(productID, context) {
  const session = await getSession(context);
  const userEmail = session?.user.email;
  
  
  

  await api.post("/fav", {
    email: userEmail,
    produtoId: productID,
  }).then( () => toast.success("produto adicionado aos favoritos"))
}

export default function Todos({ todos }) {
  // useCallback to memoize the function for better performance
  const handleLike = useCallback(
    (productID) => {
      handleLikeClick(productID);
    },
    []
  );

  return (
    <>
      <h1 className={styles.title}>Lista de produtos:</h1>
      <ul className={styles.jogoslist}>
        {todos.map(({id, nome, imgurl, preco }) => (
          <li key={id}>
            <h4>{nome}</h4>
            <img src={imgurl} alt={nome} height="240px" width="200px"/>
            <div className={styles.container_preco}>
              <p>${preco}</p>
              <div>
                <BsFillCartCheckFill className={styles.icons_cart} />
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