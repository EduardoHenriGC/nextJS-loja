import styles from '../styles/cart.module.css'
import { AiFillDelete } from 'react-icons/ai'
import { AiOutlineLine } from 'react-icons/ai'
import {MdAdd} from 'react-icons/md'
import { getSession, useSession } from 'next-auth/react'
import api from '@/Data/api'
import { useCallback, useState, useEffect } from 'react'
import { toast } from "react-toastify";


async function handleDelClick(itemID, setFavs) {
  try {
    await api.delete(`/cart${itemID}`).then( () => toast.warn("produto removido do carrinho"))
    // update favs state after deletion
    setFavs((prevFavs) => prevFavs.filter((fav) => fav.id !== itemID))
  } catch (error) {
    console.error('Failed to delete favorite:', error)
  }
}


export default function Favoritos({ carts: initialCarts }) {
  const { data: session } = useSession()
  const [cart, setCart] = useState(initialCarts)
  const [total, setTotal] = useState(0)
  const [amount, setAmount] = useState(1)
 
  useEffect(() => {
    const newTotal = cart.reduce((acc, { preco }) => acc + (preco * amount), 0)
    setTotal(newTotal)
  }, [cart, amount])

  const handleDelete = useCallback(
    (itemID) => {
      handleDelClick(itemID, setCart)
    },
    [setCart]
  )

  // function handleAddAmount(){
  //   setAmount(amount + 1)
  // }

  // function handleRemoveAmount(){
  //   if(amount > 1) setAmount(amount - 1)
  // }

  
  return (
    <>
      <h1 className={styles.title}>Carrinho : {session?.user.name}</h1>
      <ul className={styles.jogoslist}>
        {cart.map(({ id, nome, imgurl, preco }) => (
          <li key={id}>
            <img src={imgurl} height="100px" width="100px" />
            <div className={styles.content_preco}>
              <h4>{nome} </h4>
              <p> ${preco} </p>
            </div>
            {/* <div className={styles.containerIcon}>
              <MdAdd className={styles.icon} onClick={handleAddAmount} />
              <AiOutlineLine className={styles.icon} onClick={handleRemoveAmount} /> 
            </div> */}
            <div className={styles.content_delete}>
              <AiFillDelete
                className={styles.icons_thash}
                onClick={() => {
                  handleDelete(id)
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.total}>
        <p>Total: ${total}</p> <button>comprar</button>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  var cartUser = session?.user.email

  const res = await api.get(`http://localhost:8800/cart`, { params: { q: cartUser } })
  const carts = await res.data

  return {
    props: { carts },
  }
}