import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../Data/api";
import styles from "../styles/search.module.css";
import { toast } from "react-toastify";
import { FcLike } from "react-icons/fc";
import { BsFillCartCheckFill } from "react-icons/bs";
import Link from 'next/link';
import { getSession } from "next-auth/react";
import { useCallback } from 'react';



async function handleLikeClick(productID, context) {
    const session = await getSession(context);
    const userEmail = session?.user.email;
    
    
    
  
    await api.post("/fav", {
      email: userEmail,
      produtoId: productID,
    }).then( () => toast.success("produto adicionado aos favoritos"))
  }
  
  
  async function handleCartClick(productID, context) {
    const session = await getSession(context);
    const userEmail = session?.user.email;
    
    
    
  
    await api.post("/cart", {
      email: userEmail,
      produtoId: productID,
    }).then( () => toast.success("produto adicionado ao carrinho"))
  }
  

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const { query } = router.query;

  useEffect(() => {
    const fetchResults = async () => {
      const response = await api.get("/search", { params: { q: query } });
      const list = response.data
      setSearchResults(list);
    };
    fetchResults();
  }, [query]);


  const handleLike = useCallback(
    (productID) => {
      handleLikeClick(productID);
    },
    []
  );

  const handleCart = useCallback(
    (productID) => {
      handleCartClick(productID);
    },
    []
  );

  return (
    <ul className={styles.jogoslist}>
        {searchResults.map(({id, nome, imgurl, preco }) => (
          <li key={id}>
            <h4>{nome}</h4>
            <img src={imgurl} alt={nome} height="240px" width="200px"/>
            <div className={styles.container_preco}>
              <p>${preco}</p>
              <div>
                <BsFillCartCheckFill className={styles.icons_cart} 
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
  );
};

export default SearchPage;