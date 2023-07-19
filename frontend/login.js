const log = document.getElementById('log')
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
        const response = await axios.post("http://localhost:3000/login",object)
        console.log(response)
        const tokens = response.data.token
        console.log(tokens)
        localStorage.setItem("token",tokens)
        alert(response.data.message)
        window.location.href="../HTML/chat.html"
    }
    catch(err)
    {
        console.log(err.response.data)
        alert(err.response.data)
        
    }
}