import "../styles/film.css"
import axios from "axios"
import { useState, useEffect } from "react"

interface Film {
    name: string,
    description?: string,
    src: string,
    banner?: string,
    genres: string[],
    products?: string[]
}
export default function Film(){
  const [filmes, setFilmes] = useState<Film[]>([])

  useEffect(()=>{
    axios.get('http://localhost:3333/api/film')
    .then((res)=> setFilmes(res.data))
  },[])
  
  return(
    <div id='filmContainer'>
      <h1>Filmes</h1>
      <div id="listaFilmes">
        {filmes.map((filme)=> {
          return <>{filme.name}</>
        })}
      </div>
    </div>
  )
}