import Link from 'next/link'




export async function getStaticPaths() {
  const response = await fetch('http://localhost:8800/jogos/')
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
    `http://localhost:8800/jogos/${params.id}`,
  )

  const todos = await res.json()

  return {
    props: { todos },
  }
}


export default function Jogo({todos}) {
 
  console.log(todos)
  return (
    <>
      

<div>
<Link href="/jogos">
  Voltar
 </Link>
 <h1>Exibindo o todo: a {todos[0].id}</h1>
 <p>Título: {todos[0].nome}</p>
 <p>Título: {todos[0].preco}</p>
 <img src={todos[0].imgurl} width="400px" height="300px"/>
</div>

   
    </>
  )
}
