import axios from "axios";
const baseUrl = 'http://localhost:3000/api/'
export default function (){
  console.log('i am middleware',)
// context.$axios.$post('https://reqres.in/api/login',{
//   email:'eve.holt@reqres.in',
//   password:'cityslicka'
// }).then(res => console.log('responsetest',res))
   axios.post(baseUrl + '/api/login',{
     email:'eve.holt@reqres.in',
     password:'cityslicka'
 }).then(res => console.log('responsetest',res))

}
