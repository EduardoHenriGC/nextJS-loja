import Link from 'next/link'
import styles from '../../styles/jogo.module.css'
import {FcLike} from "react-icons/fc"
import {BsFillCartCheckFill} from "react-icons/bs"



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


export default function Jogo({todos}) {
 
  
  return (
    <>
      

<div className={styles.container}>
<Link className={styles.link} href="/produtos">
  Voltar
 </Link>
 <div key={todos[0].id}>

<h4 className={styles.title}>{todos[0].nome}</h4>
<div className={styles.img}><img src={todos[0].imgurl}/></div>
<div className={styles.container_preco}>
 
<p>${todos[0].preco}</p>

<div >
<BsFillCartCheckFill className={styles.icons_cart}/>
<FcLike className={styles.icons_like}/>
</div>

</div>



</div>
</div>

   
    </>
  )
}
