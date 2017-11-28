import map from './test01.map.json';

export default () => {
  const request = new XMLHttpRequest();
  request.responseType = 'json';
  request.onload = () => {
    console.log('Received map: ', request.response);
  };
  request.open('GET', map);
  request.send();
};
