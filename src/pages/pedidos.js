import styles from '../styles/pedidos.module.css'
import { getSession, useSession } from 'next-auth/react'
import api from '@/Data/api'





export default function Pedidos({ pedidos }) {
  const { data: session } = useSession()
 
  


    

  return (
    <>
     
      <table className={styles.table}>
      <caption>Lista de pedidos: {session?.user.name}</caption>
      <thead>
            <tr>
            <th>email</th>
            <th>lista de item</th>
             <th>valor</th>
             <th>data da compra</th>
           </tr>
           </thead>
           <tbody>
        {pedidos.map(({valor,email,id,listItem, dataCompra }) => (
        <>
          
           <tr key={id}>
           <td>{email}</td>
           <td>/ {listItem}</td>
           <td>${valor}</td>
           <td>{dataCompra}</td>
         </tr>
        </>
        ))}
        </tbody>
      </table>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  var pedidoItem = session?.user.email

  const res = await api.get(`http://localhost:8800/pedidos`, { params: { q: pedidoItem } })
  const pedidos = await res.data

  return {
    props: { pedidos },
  }
}