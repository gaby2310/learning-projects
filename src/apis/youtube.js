import axios from 'axios';


const KEY = 'AIzaSyA3NQerUF2nNWH92HZnh2HtR1TAfPxG8PU';

export const baseParams = {
    part: 'snippet',
    maxResults: 5,
    key: KEY
};

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
        params: baseParams
});