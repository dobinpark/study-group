import axios from "../utils/axios";

const cache = new Map();

export const cachedFetch = async (url: string) => {
  if (cache.has(url)) {
    return cache.get(url);
  }
  const response = await axios.get(url);
  cache.set(url, response.data);
  return response.data;
};
