import { useState } from 'react';
// import  {useQuery} from '@apollo/client';
// import { SEARCH_CHARACTERS } from '../garphql/graphql-get';


function Nav(){
    const [inputValue, setInputValue] = useState("")
    // const [getSearch, result] = useLazyQuery(SEARCH_CHARACTERS)
    // const { data, error, loading } = useQuery(SEARCH_CHARACTERS, {
    //     variables: { findCharacters: inputValue },
    // });
    
    const handleInput =(event)=>{
        const value = event.target.value
        setInputValue(value)
       
    }

    return <div>
        <input type="text" placeholder="🔍︎"
        value={inputValue}
        onChange={handleInput} 
        />
    </div>

}
export default Nav