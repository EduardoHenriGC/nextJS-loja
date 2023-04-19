import styles from '../../styles/Todos.module.css'

import Link from 'next/link'

export async function getStaticProps() {
  const res = await fetch('http://localhost:8800/jogos')

  const data = await res.json()

  const todos = data

  return {
    props: { todos },
  }
}

export default function Todos({ todos }) {
  return (
    <>
      <h1>Tarefas para fazer:</h1>
      <ul className={styles.todolist}>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.id} - {todo.nome} -
            <Link href={`/jogos/${todo.id}`}>
              Ver
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}