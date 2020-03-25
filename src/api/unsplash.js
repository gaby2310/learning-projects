import axios from "axios";

export default axios.create({
    baseURL: "https://api.unsplash.com",
    headers: {
        Authorization: "Client-ID kTlwItvHXN93mu-Rj2YIsbG9xG52c1GWHVL7VC1aNBs"
    }
});