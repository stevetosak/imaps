import HttpService from "../net/HttpService.js";
import config from "../net/netconfig.js";

export const verifyToken = async (setIsAuthenticated,setUsername,setLoading) => {
    const token = localStorage.getItem("token");
    const httpService = new HttpService();

    try {
        const response = await httpService.get(`${config.auth.verify}?token=${token}`);
        if (response.username) {
            setIsAuthenticated(true);
            setUsername(response.username)
            console.log("/verify resp: ",response.username);
        } else {
            setIsAuthenticated(false);
            setLoading(false);
        }
    } catch (error) {
        setIsAuthenticated(false);
    } finally {
        setLoading(false);
    }
}