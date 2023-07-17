const sign = document.getElementById('sign')

var errors = document.getElementById('error')
sign.addEventListener('submit',save)
async function save(event){
    
    event.preventDefault();

    var name = event.target.username.value
    var email = event.target.email.value
    var password = event.target.password.value
    console.log(password,name,email)
    if(!email || !name || !password){
    errors.innerHTML="Fields cannot be empty"
    return;
    }
    var object={
        name,
        email,
        password
    }
    try{
        const response = await axios.post('http://localhost:3000/signup',object)
        console.log(response)
        //window.location.href="../layout/login.html"
    }
    catch(err){
        alert(err)
       
    }

}