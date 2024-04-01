import { useLazyQuery,useQuery} from '@apollo/client';
import { SEARCH_CHARACTERS, DETAIL_CHARACTERS, FILTER_CHARACTER } from '../garphql/graphql-get';
import { useState, useEffect , useRef} from 'react';

function Characters(){

    const [filterSpecies, setFilterSpecies] = useState(new Set());
    const [filterGender, setFilterGender] = useState(new Set());
    const [filterStatus, setFilterStatus] = useState(new Set());
    const [showDialog, setShowDialog] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectGender, setSelectGender] = useState("");
    const [selectStatus, setSelectStatus] = useState("");
    const [selectSpecie, setSelectSpecie] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1)

    const {data: filterData, error: filterError, loading: filterLoadin} = useQuery(FILTER_CHARACTER,{variables:{numberPage: pageNumber}})
    const [getCharacter, {data,error, loading} ] = useLazyQuery(SEARCH_CHARACTERS)
    const [getDetail, result] = useLazyQuery(DETAIL_CHARACTERS)

    useEffect(()=>{
        filterData?.characters.results.forEach((character) => {
            setFilterGender(filterGender.add(character.gender));
            setFilterStatus(filterStatus.add(character.status));
            setFilterSpecies(filterSpecies.add(character.species));
        });
  
        if (pageNumber <= filterData?.characters.info.pages) {
            setPageNumber(pageNumber+1)

        }
    },[filterData, filterGender, filterSpecies, filterStatus, pageNumber])

    const getDetailCharacter = id =>{
        getDetail({variables: { idByCharacter: id}})
        setShowDialog(true)
    }
     // ????
    if (error) <span>`Tenemos un error ${error}`</span>
    // // // //////////
   
    const handleSelects =(event)=>{
        const {name, value} = event.target
        if (name === 'Input') {
            setInputValue(value)        
        }
        if (name === "Gender") {
            setSelectGender(value)
        }  
        if (name === "Species") {
            setSelectSpecie(value)        
        }        
        if (name === "Status") {
            setSelectStatus(value)       
        }
        setCurrentPage(1)
    }
    const resetFilters =()=>{
        setInputValue("");
        setSelectGender("");
        setSelectSpecie("");
        setSelectStatus("");
        setCurrentPage(1)
    }

    const pagination = (more)=>{
        if (more) {
            setCurrentPage(currentPage + 1);
        } else if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    useEffect(() => {
         if (inputValue !== '' || selectGender !== '' || selectSpecie !== '' || selectStatus !== '' || currentPage !== 1) {
            getCharacter({ variables: {name: inputValue, Specie: selectSpecie, Status: selectStatus, Gender: selectGender, Page: currentPage} });
         } else {
            getCharacter({variables: { name: ""}}) 
         }
    }, [inputValue, getCharacter, selectGender, selectSpecie, selectStatus, currentPage]);

    const outside =useRef(null);
    useEffect(()=>{
        if (outside?.current) {
            document.addEventListener("click", handleClick, true)
        }
    },[outside])

    const handleClick=(event)=>{
       if(!outside.current.contains(event.target)){
        setShowDialog(false)
       }
    }

    return <div>

        <input name='Input' type="text" placeholder="🔍︎"
        value={inputValue}
        onChange={handleSelects}/>

        <div>
        <select name='Gender' onChange={handleSelects}>
         <option value="">All Gender</option>   
         {[...filterGender].map((gender)=>(
             <option  value={gender}key={gender}>
              {gender}
             </option>
         ))}
        </select>

        <select name='Status' onChange={handleSelects} >
        <option value="">All Status</option>   
        {[...filterStatus].map((status)=>(
            <option value={status} key={status}>
             {status}
            </option>
        ))}
        </select>

        <select name='Species' onChange={handleSelects}>
         <option value="">All Species</option>   
        {[...filterSpecies].map((species)=>(
            <option value={species} key={species}>
             {species}
            </option>
        ))}
       </select>

       <button onClick={()=>resetFilters()}>Reset</button>
       </div>     

       {showDialog === true && (
         <dialog open>
           {result.loading ? (<>
          <p>Loading...</p>
           </>
        ) : result.error ? (
            <p>Error loading character</p>
            ) : (
            <div ref={outside}>
            <h2>{result?.data.character.name}</h2>
            <img loading="lazy" src={result?.data.character.image} alt={result?.data.character.name} />
            <p>Gender: {result?.data.character.gender}</p>
            <p>Specie: {result?.data.character.species}</p>
            <p>Status: {result?.data.character.status}</p>
            <p>Type: {result?.data.character.type ? (` ${result?.data.character.type}` ) : "Null" }</p>
            <p>Location: {result?.data.character.location.name}</p>
            <p>Origin: {result?.data.character.origin.name}</p>
            <p>Dimension: {result?.data.character.origin.dimension ? `${result?.data.character.origin.dimension}`:"Unknown"}</p>
          </div>
        )}
        <button onClick={() => setShowDialog(false)}>Cerrar</button>
         </dialog>
       )} 

       {loading ? <p>Loading...</p> :
      <div>
      {data?.characters.results.length <= 0 ? <p>Characters  Not Found </p> : 
          data?.characters.results.map(({ id, name, image}) => (
              <div key={id} onClick={()=>getDetailCharacter(id)}>
              <p>{name}</p>
              <img loading="lazy" src={image} alt={name} />
              </div>
              ))} 
      </div> } 

     <div>
        <button onClick={()=>pagination(false)}>-</button>
        <p>
        {currentPage} /
        {data?.characters.info.pages} 
        </p>
        <button onClick={()=>pagination(true)}>+</button>
     </div>
    </div>
}
export default Characters;