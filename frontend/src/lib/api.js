import axios from 'axios';

const dogApi = axios.create({
    baseURL: 'https://dog.ceo/api',
});

const backendApi = axios.create({
    baseURL: 'https://dog-gallery-app-27wb.onrender.com/',
});

export const getBreeds = async () => {
    const res = await dogApi.get('/breeds/list/all');
    return res.data.message;
};

export const getRandomImageForBreed = async (breed) => {
    const path = breed.replace('-', '/');
    const res = await dogApi.get(`/breed/${path}/images/random`);
    return res.data.message;
};

export const getBreedImages = async (breed) => {
    const path = breed.replace('-', '/');
    const res = await dogApi.get(`/breed/${path}/images`);
    return res.data.message;
};

export const toggleLike = async (imageUrl, breed, isLiked) => {
    if (isLiked) {
        await backendApi.delete('/like', { data: { image_url: imageUrl } });
    } else {
        await backendApi.post('/like', { image_url: imageUrl, breed });
    }
};

export const getLikes = async () => {
    const res = await backendApi.get('/likes');
    return res.data;
};

export const addRecentlyViewed = async (breed) => {
    await backendApi.post('/viewed', { breed });
};

export const getRecentlyViewed = async () => {
    const res = await backendApi.get('/viewed');
    return res.data;
};

export const getMostLiked = async () => {
    const res = await backendApi.get('/most-liked');
    return res.data;
};
