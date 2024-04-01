import { gql } from '@apollo/client';

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
query findCharacter($name: String, $Specie: String,  $Gender: String, $Status: String){
   characters(filter: {name: $name, species: $Specie, status: $Status, gender: $Gender}) {
   results{
    name
    id
    image
 }}}`

export const FILTER_CHARACTER = gql `
query getAllSpecies ($numberPage: Int) {
   characters(page: $numberPage){
      info{
         pages
      }
      results{
         name
         species
         gender
         status
      }
   }
}`
