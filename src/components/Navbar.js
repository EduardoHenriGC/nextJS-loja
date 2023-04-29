import { useState } from "react";
import Link from 'next/link'
import { useSession,signIn, signOut } from "next-auth/react"
import { FcLike } from "react-icons/fc";
import { BsFillCartCheckFill } from "react-icons/bs";
import styles from '../styles/Navbar.module.css'
import SearchBar from './searchBar';


export default function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false);
  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  const toggleList = () => {
    setIsOpen(false);
  }
  
  return (
    <div className={styles.navbar}>
      <button className={styles.menuBtn} onClick={toggleMenu}>
        
        <span className={styles.menuIcon}>
          
        </span>
        <hr/>
        <span className={styles.menuIcon}>
          
        </span>
        
      
      </button>
      
      <ul  className={isOpen ? styles.menuListOpen : styles.menuListClosed}>
        <li>
          <Link onClick={toggleList} href="/">Home</Link>
        </li>
        <li>
          <Link onClick={toggleList} href="/produtos">Produtos</Link>
        </li>
        <li>
          <Link onClick={toggleList} href="/about">Sobre</Link>
        </li>
        <li>
          <Link onClick={toggleList} href="/pedidos">Pedidos</Link>
        </li>
        <li>
          <Link onClick={toggleList} className={styles.like} href="/favoritos"><FcLike/></Link>
        </li>
        <li>
          <Link onClick={toggleList} className={styles.cart} href="/cart"><BsFillCartCheckFill/></Link>
        </li>
      </ul>

      <SearchBar/>

      <div className={styles.usuario}>
        <div className={styles.log}>
          {session
            ? <button className={styles.out} onClick={signOut}>Sair</button>
            : <button className={styles.in} onClick={signIn}>Entrar</button>
          }.
        </div>
        <p className={styles.name}>{session?.user.name}</p> 
        <img  src={session?.user.image} width={session ? '45px': '0'} height="45px"/>
      </div>
    </div>
  )
}