const log = document.getElementById('log')
const bcrypt = require('bcrypt')
log.addEventListener('submit',save)

async function save(event)
{
    event.preventDefault();
    var email= event.target.email.value
    var password = event.target.password.value
    if(!email || !password)
    {
        error.innerHTML= "Fields cannot be empty"
        return;
    }
    var object ={email , password}
    try{
        const response = await axios.get("http://localhost:3000/login",object)
    }
    catch(err)
    {

    }
}