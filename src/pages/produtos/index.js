import styles from '../../styles/jogos.module.css'
import {FcLike} from "react-icons/fc"
import {BsFillCartCheckFill} from "react-icons/bs"
import Link from 'next/link'

export async function getStaticProps() {
  const res = await fetch('http://localhost:8800/produtos')

  const data = await res.json()

  const todos = data

  return {
    props: { todos },
  }
}

export default function Todos({ todos }) {
  return (
    <>
      <h1 className={styles.title}>Lista de produtos:</h1>
      <ul className={styles.jogoslist}>
        {todos.map((todo) => (
          <li key={todo.id}>
            <h4>{todo.nome} </h4>
            <img src={todo.imgurl} height="240px" width="200px"/>
            <div className={styles.container_preco}>
 
<p>${todo.preco}</p>

<div >
<BsFillCartCheckFill className={styles.icons_cart}/>
<FcLike className={styles.icons_like}/>
</div>

</div>
            <Link className={styles.link} href={`/produtos/${todo.id}`}>
              Ver mais..
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}