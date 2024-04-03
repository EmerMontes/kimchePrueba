import { useLazyQuery,useQuery} from '@apollo/client';
import { SEARCH_CHARACTERS, DETAIL_CHARACTERS, FILTER_CHARACTER } from '../garphql/graphql-get';
import { useState, useEffect , useRef} from 'react';

function Characters(){
    
    const outside =useRef(null);
    const dialogShow =useRef(null);
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
    const inputPagination = (event)=>{
        
        if (event.target.value === '') {
            setCurrentPage(1)       
        }else{
            setCurrentPage(Number(event.target.value))
        }
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

    const handleClick=(event)=>{
       if(dialogShow.current && !outside?.current.contains(event.target)){
          setShowDialog(false)
       }
    }
    useEffect(()=>{
        return document.addEventListener("click", handleClick, true)
    },[outside])


    if (error) <span>`Tenemos un error ${error}`</span>


    return <div className='hola'>
        
        <section className='header'>
        <h1>Rick And Morty </h1>
        <span className='kimche'>EmerM<img className='logo' src='../../public/logo.png'/></span>
        </section>

        <div>
         <div className='filters'>
         <section className='search'>

        <input name='Input' type="text" placeholder="🔍︎"
        value={inputValue}
        onChange={handleSelects}/>
        <button className='reset' onClick={()=>resetFilters()}><svg className="svgIcon" fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><g stroke="#ff342b" stroke-linecap="round" strokeWidth="1.5"><path d="m3.33337 10.8333c0 3.6819 2.98477 6.6667 6.66663 6.6667 3.682 0 6.6667-2.9848 6.6667-6.6667 0-3.68188-2.9847-6.66664-6.6667-6.66664-1.29938 0-2.51191.37174-3.5371 1.01468"></path><path d="m7.69867 1.58163-1.44987 3.28435c-.18587.42104.00478.91303.42582 1.0989l3.28438 1.44986"></path></g></svg>
        </button>
        </section>
         <section>

 
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
        </section>
        </div>

       
       <div className='pagination'> 
        <button disabled={currentPage === 1} onClick={()=>pagination(false)}> - </button>
        <input min='1' max={data?.characters.info.pages} name='numberPage' type="number" placeholder={ `${currentPage}/${data?.characters.info.pages}`} onChange={inputPagination} />
        <button disabled={currentPage === data?.characters.info.pages} onClick={()=>pagination(true)}> + </button>
     </div>
       </div>     

       {showDialog === true && (
         <dialog ref={dialogShow} className='dialog' open>
           {result.loading ? (
          <p>Loading...</p>
          ):result.error ? (<>
            <p>Error loading character</p>
            <button onClick={() => setShowDialog(false)}>X</button>
          </>
            ) : (
            <div className='detail' ref={outside}>
            <img loading="lazy" src={result?.data.character.image} alt={result?.data.character.name} />
            <div className='detailResumen'>

            <button onClick={() => setShowDialog(false)}>X</button>
            <h2>{result?.data.character.name}</h2>

            <p><strong>Gender:</strong> {result?.data.character.gender}</p>
            <p><strong>Specie:</strong> {result?.data.character.species}</p>
            <p><strong>Status:</strong> {result?.data.character.status}</p>
            <p><strong>Type:</strong> {result?.data.character.type ? (` ${result?.data.character.type}` ):"Null"}</p>
            <p><strong>Location:</strong> {result?.data.character.location.name}</p>
            <p><strong>Origin:</strong> {result?.data.character.origin.name}</p>
            <p><strong>Dimension:</strong> {result?.data.character.origin.dimension ? `${result?.data.character.origin.dimension}`:"Unknown"}</p>
            </div>
          </div>
        )}
        </dialog>
       )} 

       {loading ? <p>Loading...</p> :
      <div className='characters'>
      {data?.characters.results.length <= 0 ? <h1> Characters  Not Found </h1> : 
          data?.characters.results.map(({ id, name, image}) => (
              <div className='character' key={id}>
              <img onClick={()=>getDetailCharacter(id)} className='imgs' loading="lazy" src={image} alt={name} />
              <p onClick={()=>getDetailCharacter(id)}>{name}</p>
              </div>
              ))} 
      </div> } 
    </div>
}
export default Characters;