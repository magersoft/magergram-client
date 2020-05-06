const URL = process.env.REACT_APP_IP_URL;
const API_KEY = process.env.REACT_APP_IP_KEY;

export default async () => {
  if (URL && API_KEY) {
    try {
      const response = await fetch(URL + API_KEY);
      return await response.json();
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  console.log('IP URL or IP KEY not defined');
  return false;
}
