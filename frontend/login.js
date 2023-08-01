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
        const response = await axios.post("http://13.232.232.234:3000/login",object)
        console.log(response)
        const tokens = response.data.token
        const uname =  response.data.name
        console.log(tokens)
        localStorage.setItem("token",tokens)
        localStorage.setItem("name",uname)
        alert(response.data.message)
        window.location.href="../HTML/chat.html"
    }
    catch(err)
    {
        console.log(err.response.data)
        alert(err.response.data)
        
    }
}