import styles from '../../styles/produto.module.css'
import {FcLike} from "react-icons/fc"
import {BsFillCartCheckFill} from "react-icons/bs"
import { useCallback,} from 'react';
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import api from '@/Data/api';



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

export default function Jogo({todos}) {



  
  
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

  const {id, nome, imgurl, preco,descricao } = todos[0]

  return (
    <>
      

<div className={styles.container}>

 <div key={id}>

<h4 className={styles.title}>{nome}</h4>
<div className={styles.img}><img src={imgurl}/></div>
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




</div>
<div>
<h3 className={styles.h3}>Descrição</h3>
<div className={styles.descricao}>{descricao}</div>
</div>
</div>

   
    </>
  )
}


export async function getStaticPaths() {
  const response = await fetch('http://localhost:8800/produtos/')
  const data = await response.json()

  const paths = data.map((todo) => {
    return {
      params: {
        id: `${todo.id}`
      }
    }
  })

 
  return { paths, fallback: false }
}


export async function getStaticProps({params}) {
 
  const res = await fetch(
    `http://localhost:8800/produtos/${params.id}`,
  )

  const todos = await res.json()

  return {
    props: { todos },
  }
}
