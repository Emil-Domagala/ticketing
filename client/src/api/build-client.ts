import axios from 'axios';

export const buildClient = ({ req }: { req?: Request }) => {
  if (typeof window === 'undefined') {
    // Running on the server
    console.log('On server');
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req ? Object.fromEntries(req.headers.entries()) : {},
    });
  } else {
    // Running on the client
    console.log('On client');
    return axios.create({
      baseURL: '/',
      withCredentials: true, // Ensure cookies are included in requests
    });
  }
};
