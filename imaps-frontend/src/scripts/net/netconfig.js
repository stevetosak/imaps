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
        publish: `${API_PROTECTED}/publish/add`,
        publish_get: `${API_PROTECTED}/publish/get`,
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
        navigate: `${API_PUBLIC}/navigate`,
        add_favourite: `${API_PROTECTED}/favourites/add`,
    },
    favourites: {
        display: `${API_PROTECTED}/favourites`,
        add: `${API_PROTECTED}/favourites/add`,
        delete: `${API_PROTECTED}/favourites/delete`,
    },
    auth:{
        login: `${API_AUTH}/login`,
        register: `${API_AUTH}/register`,
        verify: `${API_AUTH}/verify`,
        oauth: {
            github: {
                state: `${API_BASE_URL}/oauth/state`,
                redirectUri : `${API_BASE_URL}/oauth/callback`
            }
        }

    },
    admin:{
        display: `${API_BASE_URL}/admin`,
        load_pr: `${API_BASE_URL}/admin/load-pr`,
        approve_pr: `${API_BASE_URL}/admin/pr/approve`,
        deny_pr: `${API_BASE_URL}/admin/pr/deny`
    }
};


export default config;
