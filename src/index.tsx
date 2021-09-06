import React from 'react';
import ReactDOM from 'react-dom';

//PWA
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { onServiceWorkerUpdate } from '@3m1/service-worker-updater';

//Styles et JS globaux
import 'assets/scss/_main.scss';
import 'assets/ts/_main';

//App
import App from 'screens/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: onServiceWorkerUpdate
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
