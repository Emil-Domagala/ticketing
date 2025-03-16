// import { apiService } from '@/services/apiService';
// import axios from 'axios';

export default async function Home() {
    
    // console.log(user);

    return (
      <>
      <h1 >Home</h1>
        {/* HOME {user ? `Welcome, ${user}` : 'Not logged in'} */}
      </>
    );
}

// Home.getInitialProps = async ()=>{
//   console.log("Initial");
// // const response = await axios.get('http://ingress-nginx.ingress-nginx-controller.svc.cluster.local/api/users/current-user'); 

// return response.data
// }