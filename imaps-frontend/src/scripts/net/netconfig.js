
const config = {
    apiBaseUrl: "http://localhost:8080/api",

    endpoints: {
        login: "/auth/login",
        register: "/auth/register",
        verify: "/auth/verify",
        render: "/protected/render",
        publicMapData: "/public/mapData"
    }
};

export default config;
