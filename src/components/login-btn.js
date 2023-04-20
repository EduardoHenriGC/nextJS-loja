// import { useSession, signIn, signOut } from "next-auth/react"
// import styles from '../styles/login.module.css'

// export default function ComponentLogin() {
//   const { data: session } = useSession()
  
//   if (session) {
//     return (
//       <div className={styles.sigout}>
//         Signed in as {session.user.email} <br />
        
//         <button onClick={() => signOut()}>Sign out</button>
//       </div>
//     )
//   }
//   return (
//     <div className={styles.signin}>
//       <p>Você não está conectado !!!</p>
//       <p>entre com o Gmail</p> <br />
//       <button onClick={() => signIn()}>GMAIL</button>
//     </div>
//   )
// }