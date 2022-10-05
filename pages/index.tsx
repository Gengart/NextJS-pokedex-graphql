import { gql, useLazyQuery, useQuery } from '@apollo/client'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import apollo from '../apollo'
import styles from '../styles/Home.module.css'

const QUERY = gql`
query GetPokemons($name: String) {
  pokemons: pokemon_v2_pokemon(limit: 50, where: { name: { _ilike: $name } }) {
    id
    name
  }
}
`

export const getServerSideProps = async () => {
  const { data } = await apollo.query({
    query: QUERY,
    variables: {
      name: "%%"
    }
  })

  return {
    props: {
      pokemons: data as BasicPokemon[]
    }
  }
}

type BasicPokemon = {
  id: number
  name: string
}

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ pokemons: SSRpokemons }) => {

  const [fetch, { data }] = useLazyQuery<{ pokemons: BasicPokemon[] }>(QUERY)

  return (
    <div className={styles.container}>
      <input
        type="text"

        onKeyDown={event => {
          if (event.code === 'Enter') {
            fetch({
              variables: {
                name: `%${(event.target as HTMLInputElement).value}%`
              }
            })
          }
        }} />
      <pre>
        {JSON.stringify(data?.pokemons ?? SSRpokemons, null, 2)}
      </pre>
    </div>
  )
}

export default Home
