import styles from '../styles/cart.module.css'
import { AiFillDelete } from 'react-icons/ai'
import { getSession, useSession } from 'next-auth/react'
import api from '@/Data/api'
import { useCallback, useState, useEffect } from 'react'
import { toast } from "react-toastify";
import InputCep from "../components/InputCep.js"
import InputTelefone from "../components/InputTelefone.js"

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
 const [cep, setCep] = useState('');
 const [fone, setfone] = useState('');
 const [isAptoSelected, setIsAptoSelected] = useState(false);
 const [isCasaSelected, setIsCasaSelected] = useState(false);


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


 
  
  const handleAptoChange = () => {
    setIsAptoSelected(true);
    setIsCasaSelected(false);
  };

  const handleCasaChange = () => {
    setIsCasaSelected(true);
    setIsAptoSelected(false);
  };

  

  
  const handleSubmit = async (e, context) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    
    const nmrCasa = formData.get("nmrCasa");
    const nmRua = formData.get("nmRua");
    const cep = formData.get("cep");
    const telefone = formData.get("telefone");
    var tipoImovel;
    if (isAptoSelected) {
     var tipoImovel = "apto";
    } else if (isCasaSelected) {
      var tipoImovel = "casa";
    }
  
    if (!telefone || !nmrCasa || !nmRua || !cep || !tipoImovel) {
      toast.warn("Preencha todos os campos");
      return;
    }
    
    
    const session = await getSession(context);
    const userEmail = session?.user.email;
    
     const confirmDelete = window.confirm('Tem certeza que deseja efetuar essa compra ?');
   if (confirmDelete)
  
    await api
     .post("/pedidos", {
    email: userEmail,
        listItem: list,
        valor: total,
    nmRua,
    nmrCasa,
    tipoImovel,
    cep,
    telefone,
       })
     .then(() => {
       toast.success("compra realizada com sucesso");
        setfone("");
        setCep("");
    e.target.reset();
      })
       .catch(() => toast.error("não foi possivel processar seu pedido"));
      
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
      <p className={styles.total}>valor total: {total.toFixed(2)}</p>

    <form className={styles.form}  onSubmit={handleSubmit}>
    
    
     
     
      <div>
        
        <input placeholder='DIGITE O NOME DA RUA' className={styles.form_input}  name="nmRua" type="text" />
      </div>
     
      <div className={styles.checkbox}>
     <div className={styles.checkbox_content}> 
     <label htmlFor="apto">Apto</label>
      <input
        type="checkbox"
        id="apto"
        name="apto"
        value="apto"
        checked={isAptoSelected}
        onChange={handleAptoChange}
        
      /></div>
    <div className={styles.checkbox_content}>
    <label htmlFor="casa">Casa</label>
      <input 
        type="checkbox"
        id="casa"
        name="casa"
        value="casa"
        checked={isCasaSelected}
        onChange={handleCasaChange}
        
      />
    </div>
    </div>
      
      
        
        <input placeholder='DIGITE O NUMERO DA CASA' className={styles.form_input} maxlength="5" name="nmrCasa" type="tel" />
      
        
        <InputCep className={styles.form_input} value={cep} onChange={setCep} />
      
      
        
        <InputTelefone className={styles.form_input} value={fone} onChange={setfone} />
      

      <button type="submit" className={styles.submit}>comprar</button>
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