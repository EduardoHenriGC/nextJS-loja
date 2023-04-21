import styles from '../styles/fav.module.css'
import {FcLike} from "react-icons/fc"
import {BsFillCartCheckFill} from "react-icons/bs"
import Link from 'next/link'
import { useSession } from "next-auth/react"
import api from '@/Data/api'

 


export default function Favoritos({ favs }) {
 
  const { data: session } = useSession()
  const user = session?.user.email
  console.log(user)
  
  return (
 
    <>
      <h1 className={styles.title}>Lista de favoritos: {session?.user.name}</h1>
      <ul className={styles.jogoslist}>
      
        {favs.map((fav) => (
          <li key={fav.id}>
            <h4>{fav.nome} </h4>
            <img src={fav.imgurl} height="240px" width="200px"/>
            <div className={styles.container_preco}>
              
 
<p>${fav.preco}</p>

<div >
<BsFillCartCheckFill className={styles.icons_cart}/>
<FcLike className={styles.icons_like}/>
</div>

</div>
            <Link className={styles.link} href={`/produtos/${fav.id}`}>
              Ver mais..
            </Link>
          </li>
        ))}
      </ul>
    </>
  ) 
}


export async function getStaticProps() {
  
  
  const favUser = 's2ltfsqn@gmail.com';

  const res = await api.get(`http://localhost:8800/fav`,{ params: { q: favUser } })

  const favs = await res.data


  

  

  return {
    props: { favs },
  }
}

