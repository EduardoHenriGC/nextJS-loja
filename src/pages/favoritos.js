
import styles from '../styles/fav.module.css'
import { BsFillCartCheckFill } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import Link from 'next/link'
import { getSession, useSession } from 'next-auth/react'
import api from '@/Data/api'
import { useCallback, useState } from 'react'
import { toast } from "react-toastify";

async function handleDelClick(itemID, setFavs) {
  try {
    await api.delete(`/fav${itemID}`).then( () => toast.warn("produto removido dos favoritos"))
    // update favs state after deletion
    setFavs((prevFavs) => prevFavs.filter((fav) => fav.id !== itemID))
  } catch (error) {
    console.error('Failed to delete favorite:', error)
  }
}

async function handleCartClick(itemID, context) {
  const session = await getSession(context);
  const userEmail = session?.user.email;
  
  
  



  await api.post("/cart", {
    email: userEmail,
    produtoId: itemID,
  }).then( () => toast.success("produto adicionado ao carrinho"))
}

export default function Favoritos({ favs: initialFavs }) {
  const { data: session } = useSession()
  const [favs, setFavs] = useState(initialFavs)
  


    

  const handleDelete = useCallback(
    (itemID) => {
      handleDelClick(itemID, setFavs)
    },
    [setFavs]
  )
  const handleCart = useCallback(
    (itemID) => {
      handleCartClick(itemID);
    },
    []
  );
  return (
    <>
      <h1 className={styles.title}>Lista de favoritos: {session?.user.name}</h1>
      <ul className={styles.jogoslist}>
        {favs.map(({ produtoID,id, nome, imgurl, preco }) => (
          <li key={id}>
            <h4>{nome} </h4>
            <img src={imgurl} height="240px" width="200px" />
            <div className={styles.container_preco}>
              <p> ${preco} </p>
              <div>
                <BsFillCartCheckFill className={styles.icons_cart} 
                onClick={() => {
                  handleCart(produtoID)
                }}/>
                <AiFillDelete
                  className={styles.icons_thash}
                  onClick={() => {
                    handleDelete(id)
                  }}
                />
              </div>
            </div>
            
            <Link className={styles.link} href={`/produtos/${produtoID}`}>
              Ver mais..
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  var favorito = session?.user.email

  const res = await api.get(`http://localhost:8800/fav`, { params: { q: favorito } })
  const favs = await res.data

  return {
    props: { favs },
  }
}