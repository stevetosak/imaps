import {useEffect} from "react";
import HttpService from "../../scripts/net/HttpService.js";
import log from "eslint-plugin-react/lib/util/log.js";

export const AdminPage = () => {
    useEffect(() => {
        const httpService = new HttpService(true);
        httpService.get("http://localhost:8080/api/auth/test_auth").then(r => console.log("RESP TEST: " + JSON.stringify(r))).catch(reason => console.log("ERR",reason))
    }, []);
}