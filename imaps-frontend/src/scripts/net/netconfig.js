export const API_BASE_URL = "http://localhost:8080/api";
export const API_PROTECTED = `${API_BASE_URL}/protected`
export const API_PUBLIC = `${API_BASE_URL}/public`
export const API_AUTH = `${API_BASE_URL}/auth`


const config = {
    my_maps: {
        display: `${API_PROTECTED}/my-maps`,
        save: `${API_PROTECTED}/my-maps/save`,
        add: `${API_PROTECTED}/my-maps/create`,
        load: `${API_PROTECTED}/my-maps/load`,
        delete: `${API_PROTECTED}/my-maps/delete`,
    },
    room_types: {
        display: (auth) => {
            return auth ? `${API_PROTECTED}/room-types` : `${API_PUBLIC}/room-types`
        },
        add: `${API_PROTECTED}/room-types/add`,

    },
    floors: {
        add: `${API_PROTECTED}/floors/add`,
        load: `${API_PROTECTED}/my-maps/load`,
        delete: `${API_PROTECTED}/floors/delete`,
    },
    view_maps: {
        display: `${API_PUBLIC}/maps`,
        load: (auth) => {
            return auth ? `${API_PROTECTED}/load-map` : `${API_PUBLIC}/load-map`
        },
        navigate: `${API_PUBLIC}/navigate`
    },
    favourites: {
        display: `${API_PROTECTED}/favourites`,
        add: `${API_PROTECTED}/favourites/add`,
        delete: `${API_PROTECTED}/favourites/delete`,
    },
    auth:{
        login: `${API_AUTH}/login`,
        register: `${API_AUTH}/register`,
        verify: `${API_AUTH}/verify`

    }
};


export default config;
