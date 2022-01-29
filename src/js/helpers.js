import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // fetching from the api
    const fetchPromises = [fetch(url), timeout(TIMEOUT_SEC)];
    const response = await Promise.race(fetchPromises);

    // converting response promise into json
    const data = await response.json();

    // catching for the 400+ errors
    if (!response.ok) throw new Error(`(${response.status}) ${data.message}`);

    return data;
  } catch (error) {
    throw error;
  }
};
