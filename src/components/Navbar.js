import Link from 'next/link'
import { useSession,signIn, signOut } from "next-auth/react"

import styles from '../styles/Navbar.module.css'



export default function Navbar() {
  const { data: session } = useSession()
  
  return (
    <div className={styles.navbar}>
      
      <ul >
      <li>
        <Link href="/">Home</Link>
      </li>
      
      <li>
        <Link href="/produtos">produtos</Link>
      </li>
      <li>
        <Link href="/about">Sobre</Link>
      </li>
      <li>
        <Link href="/contact">Contato</Link>
      </li>
      <li>
        <Link href="/favoritos">favoritos</Link>
      </li>

      <li>
        <Link href="/cart">cart</Link>
      </li>
      
    </ul>
    <div className={styles.usuario}>
    <div className={styles.log}> {session
        ? <button className={styles.out} onClick={signOut}>Sair</button>
        : <button className={styles.in}  onClick={signIn}>Entrar</button>
      }.</div>

      
      <p >{session?.user.name}</p> 
    <img  src={session?.user.image} width={session ? '40px': '0'} height="40px"/></div>
    </div>
  )
}