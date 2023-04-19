import Head from 'next/head'
import Link from "next/link"

export default function Contact() {
  return (
    <>
      <Head>
        <title>Página de Contato</title>
      </Head>
      <h1>Página de Contato</h1>
      <Link href="/">
        Voltar
      </Link>
    </>
  )
}