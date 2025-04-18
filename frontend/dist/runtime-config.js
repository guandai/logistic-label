// in docker, I have ENV REACT_APP_RUNTIME_CONFIG=true
//  the html file allow to read this file,
// and docker will replace the content of this file with the env variables
if (window.react_app_runtime_config) {
  window.__RUNTIME_CONFIG__ = {
    REACT_APP_BE_URL: 'REACT_APP_BE_URL_PLACEHOLDER',
    REACT_APP_FE_URL: 'REACT_APP_FE_URL_PLACEHOLDER',
    REACT_APP_SOCKET_IO_HOST: 'REACT_APP_SOCKET_IO_HOST_PLACEHOLDER',
    REACT_APP_BEANS_API_URL: 'REACT_APP_BEANS_API_URL_PLACEHOLDER',
    REACT_APP_BEANS_API_KEY: 'REACT_APP_BEANS_API_KEY_PLACEHOLDER'
  };  
}
