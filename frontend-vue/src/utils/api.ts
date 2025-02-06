import axios from "../utils/axios";

// 간단한 캐시 구현을 위한 Map 객체
const cache = new Map<string, any>();

/**
 * 캐시된 데이터를 가져오는 함수
 * @param url - 요청할 URL
 * @returns 캐시된 데이터 또는 새로 요청한 데이터
 */
export const cachedFetch = async (url: string) => {
  // 캐시에 데이터가 있는지 확인
  if (cache.has(url)) {
    return cache.get(url); // 캐시된 데이터 반환
  }

  // 데이터가 없으면 새로 요청
  const response = await axios.get(url);
  cache.set(url, response.data); // 응답 데이터를 캐시에 저장
  return response.data; // 응답 데이터 반환
};
