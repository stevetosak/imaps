
const config = {
    apiBaseUrl: "http://localhost:8080/api",

    endpoints: {
        login: "/auth/login",
        register: "/auth/register",
        verify: "/auth/verify",
        render: "/protected/render",
        public: {
            load: "/public/load-map"
        },
        protect:{
            load: "/protected/load-map"
        }

    }
};

export default config;
