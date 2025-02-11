import config from "./netconfig.js";


class HttpService {
    constructor(auth = false) {
      this.auth = auth;
    }

    setAuthenticated(){
        this.auth = true;
    }

    async request(method, endpoint, data = null) {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (this.auth) {
        const token = localStorage.getItem("token"); 
        if (token) {
          options.headers['Authorization'] = `Bearer ${token}`;
        } else {
            throw new Error("No token found!");
        }
      }
  
      if (data) {
        options.body = JSON.stringify(data);
      }
  
      const response = await fetch(`${endpoint}`, options);
      
      if (!response.ok) {
        switch (response.status) {
            case 401:
              console.log("Unauthorized: Invalid token or session expired");
              break;
            case 403:
              console.log("Forbidden: You don't have permission to access this resource");
              window.location.href = "/Login";
              break;
            case 500:
              console.log("Server error: Try again later");
              break;
            default:
              console.log(`Unexpected error: ${response.status}`);
          }
        throw new Error(`Error! status: ${response.status}`);
      }

      console.log("HTTPSERVICE: RESPONSE:",response);
  
      return response.json();
    }
  
    get(endpoint) {
      return this.request('GET', endpoint);
    }
  
    post(endpoint, data) {
      return this.request('POST', endpoint, data);
    }
  
    put(endpoint, data) {
      return this.request('PUT', endpoint, data);
    }
  
    delete(endpoint) {
      return this.request('DELETE', endpoint);
    }
  }
  
  export default HttpService;
  