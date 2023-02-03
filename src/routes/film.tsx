import { Form } from 'react-router-dom';

interface Film {
    name: string,
    description?: string,
    src: string,
    banner?: string,
    genres: string[],
    products?: string[]
}
export default function film(){
  const film: Film = {
    name: 'Filme Teste',
    description: "Filme de teste",
    src: "www.com.br",
    banner: "www.com.br",
    genres: [],
  }

  return(
    <div>
      
    </div>
  )
}