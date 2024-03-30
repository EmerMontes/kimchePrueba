import { gql } from '@apollo/client';

export const All_CHARACTERS = gql`
   query{
    characters {
     results{
      name
      image
      id
}}}`

export const DETAIL_CHARACTERS = gql`
   query findCharacterDetail($idByCharacter: ID!){
    character(id: $idByCharacter) {
        id
        name
        image
        status
        gender
        species
        type 
        location{name}
        origin{
          name
         dimension
        }
}}`

export const SEARCH_CHARACTERS = gql`
query findCharacter($findCharacters: String){
  characters(filter: {name: $findCharacters}) {
  results{
   name
   id
   image
}}}`