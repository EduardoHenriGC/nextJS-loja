import {useState,useCallback } from 'react';
import styles from '../styles/search.module.css';
import { FcLike } from "react-icons/fc";
import { BsFillCartCheckFill } from "react-icons/bs";
import Link from 'next/link';
import api from '@/Data/api';
import { useRouter } from 'next/router'
import {BsSearch} from "react-icons/bs"
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";

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


const SearchPage = () =>{

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await api.get('/search', { params: { q: searchTerm } });
    setSearchResults(response.data);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
    const router = useRouter()

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
return <>


<>

 {/* <button onClick={()=>{

  router.push('/produtos')
 }}>VOLTAR</button> */}

    <form className={styles.search}  onSubmit={handleSubmit}>
  <input type="text" onClick={()=>{router.push("/search")}} value={searchTerm} onChange={handleChange}  id="txtBusca" placeholder="Buscar..."/>
  <button type="submit"><BsSearch id="icon-busca"/></button>
</form>

       
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

    </>
</>



}
export default SearchPage;