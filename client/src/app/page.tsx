import axios from 'axios';

const getCurrentUser = async () => {
  try {
    // const client = buildClient({});
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/current-user',
      { withCredentials: true, headers: { Host: 'ticketing.dev' } },
    );
    console.log(data);
    return data.currentUser;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

const Home = async () => {
  const currentUser = await getCurrentUser();

  return (
    <>
      <h1>Home</h1>
      {currentUser}
      {/* HOME {user ? `Welcome, ${user}` : 'Not logged in'} */}
    </>
  );
};

export default Home;
