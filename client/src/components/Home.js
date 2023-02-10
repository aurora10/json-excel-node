import axios from "axios"


function Home() {



  const send_email = () => {
    
    axios.get('http://localhost:5000/message')
    .then(response => {
        // Handle response
        console.log(response.data);
    })
    .catch(err => {
        // Handle errors
        console.error(err);
    });
          
          
       
  }  
  return (

    <div className="grid grid-cols-3">
        <div></div>
        
         <button className="mt-4 p-3 border rounded-full bg-orange-500" onClick={send_email}>Send Me Email With Export</button>
        <div></div>
      
    </div>
    
  )
}

export default Home