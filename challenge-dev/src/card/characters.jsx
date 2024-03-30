import {useQuery, useLazyQuery} from '@apollo/client';
import { SEARCH_CHARACTERS, DETAIL_CHARACTERS } from '../garphql/graphql-get';
import { useState } from 'react';

function Characters(){
    const {data, error, loading} = useQuery(SEARCH_CHARACTERS)
    const [getDetail, result] = useLazyQuery(DETAIL_CHARACTERS)
    const [showDialog, setShowDialog] = useState(false);

    const getDetailCharacter = id =>{
        getDetail({variables: { idByCharacter: id}})
        setShowDialog(true)
    }
    const closeDialog = () => {
       if (showDialog === true) {
        setShowDialog(false)
       }
    }

    if (error) <span>{error}</span>

    return <div onClick={()=>closeDialog()} >

       {showDialog === true && (
         <dialog open>
           {result.loading ? (<>
          <p>Loading...</p>
           </>
        ) : result.error ? (
            <p>Error loading character</p>
            ) : (
            <div>
            <h2>{result?.data.character.name}</h2>
            <img loading="lazy" src={result?.data.character.image} alt={result?.data.character.name} />
            <p>Gender: {result?.data.character.gender}</p>
            <p>Specie: {result?.data.character.species}</p>
            <p>Status: {result?.data.character.status}</p>
            <p>type: {result?.data.character.type ? (` ${result?.data.character.type}` ) : "Null" }</p>
            <p>Location: {result?.data.character.location.name}</p>
            <p>origin: {result?.data.character.origin.name}</p>
            <p>dimension: {result?.data.character.origin.dimension ? `${result?.data.character.origin.dimension}`:"Unknown"}</p>
          </div>
        )}
        <button onClick={() => setShowDialog(false)}>Cerrar</button>
         </dialog>
       )} 

      {loading ? <p>Loading...</p> :
      <div>
      {data?.characters.results.map(({ id, name, image}) => (
         <div key={name} onClick={()=>getDetailCharacter(id)}>
            <p>{name}</p>
            <img loading="lazy" src={image} alt={name} />
         </div>
      ))}
      </div> }

    </div>
}
export default Characters;