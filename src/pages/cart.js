import styles from '../styles/cart.module.css'
import { AiFillDelete } from 'react-icons/ai'
import { getSession, useSession } from 'next-auth/react'
import api from '@/Data/api'
import { useCallback, useState, useEffect } from 'react'
import { toast } from "react-toastify";


async function handleDelClick(itemID, setFavs) {
  const confirmDelete = window.confirm('Tem certeza que deseja excluir esse item do carrinho?');
    if (confirmDelete)
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
 const [list,setList] = useState([])


  useEffect(() => {
    const newTotal = cart.reduce((acc, { preco }) => acc + (preco * amount), 0)
    setTotal(newTotal)
  }, [cart, amount])


  useEffect(() => {
    const newList = cart.reduce((prev, { produtoID,nome }) => prev + ( produtoID +":" + nome + "----"), [])
    setList(newList)
  }, [cart])

  const handleDelete = useCallback(
    (itemID) => {
      handleDelClick(itemID, setCart)
    },
    [setCart]
  )
  const handlePedidos = useCallback(
    (nmrCasa,nmRua,cep,tel) => {
      handleSubmit(nmrCasa,nmRua,cep,tel)
    },
    
  )

 
  
 

  

  
  const handleSubmit = async (e, context) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    
    const telefone = formData.get("telefone");
    const nmrCasa = formData.get("nmrCasa");
    const nmRua = formData.get("nmRua");
    const cep = formData.get("cep");
  
    const session = await getSession(context);
    const userEmail = session?.user.email;
  
    await api
      .post("/pedidos", {
        email: userEmail,
        listItem: list,
        valor: total,
        nmRua,
        nmrCasa,
        cep,
        telefone,
      })
      .then(() => toast.success("deu bom"))
      .catch(() => toast.error("deu ruinm"));
  };

  
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

    <form className={styles.form}  onSubmit={handleSubmit}>
    
    
      <div>
        <label>Telefone</label>
        <input name="telefone" type="number"/>
      </div>
     
      <div>
        <label>Nome da rua</label>
        <input  name="nmRua" type="text" />
      </div>
      <div>
        <label>Numero da casa</label>
        <input  name="nmrCasa" type="number" />
      </div>
      <div>
        <label>cep</label>
        <input  name="nmRua" type="number" />
      </div>

      <button type="submit" className={styles.submit}>SALVAR</button>
    </form>
      
            
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