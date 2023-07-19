const send = document.getElementById('send')
const msg = document.getElementById('msg')
const token = localStorage.getItem("token")
console.log(token)
send.addEventListener('click',save)
async function save(event)
{
    var text = msg.value
    try{
        const response = await axios.post("http://localhost:3000/chat", { "msg": text }, {
            headers: {
              'Authorization': token
            }
          })
        console.log(response)
    }
    catch(err)
    {
        console.log(err)
    }
}