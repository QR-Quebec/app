import React, { Component, Suspense } from 'react';
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';

//Style
import './App.scss';

//Components
import ErrorBoundary from 'components/ui/ErrorBoundary';
import AppUpdatedPrompt from 'components/ui/AppUpdatedPrompt';

//PayPal
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

//Libs
import * as localForage from 'localforage';
import { initData } from 'lib/data';
import { syncUsageStats } from 'lib/sync';

//Icones
import Logo from 'assets/svg/icon.svg';
import { HelpCircleSharp, QrCodeSharp } from 'react-ionicons';

//Page primaire (loadée dans le même request)
import PassportsHome from 'screens/passports/Home';

//Pages secondaires (loadées en BG)
const PassportsAdd = React.lazy(() => import(/* webpackPrefetch: true */ "./passports/_Pages").then((module) => ({ default: module.PassportsAdd })));
const PassportsAddConfirm = React.lazy(() => import(/* webpackPrefetch: true */ "./passports/_Pages").then((module) => ({ default: module.PassportsAddConfirm })));
const PassportsAddLimit = React.lazy(() => import(/* webpackPrefetch: true */ "./passports/_Pages").then((module) => ({ default: module.PassportsAddLimit })));
const PassportsAddLimitPurchased = React.lazy(() => import(/* webpackPrefetch: true */ "./passports/_Pages").then((module) => ({ default: module.PassportsAddLimitPurchased })));
const PassportsShow = React.lazy(() => import(/* webpackPrefetch: true */ "./passports/_Pages").then((module) => ({ default: module.PassportsShow })));
const PassportsDetail = React.lazy(() => import(/* webpackPrefetch: true */ "./passports/_Pages").then((module) => ({ default: module.PassportsDetail })));
const PassportsInvalidNotShc = React.lazy(() => import(/* webpackPrefetch: true */ "./passports/_Pages").then((module) => ({ default: module.PassportsInvalidNotShc })));
const PassportsInvalidAlg = React.lazy(() => import(/* webpackPrefetch: true */ "./passports/_Pages").then((module) => ({ default: module.PassportsInvalidAlg })));
const PassportsInvalidIssuer = React.lazy(() => import(/* webpackPrefetch: true */ "./passports/_Pages").then((module) => ({ default: module.PassportsInvalidIssuer })));
const PassportsInvalidSignature = React.lazy(() => import(/* webpackPrefetch: true */ "./passports/_Pages").then((module) => ({ default: module.PassportsInvalidSignature })));
const PassportsInvalidError = React.lazy(() => import(/* webpackPrefetch: true */ "./passports/_Pages").then((module) => ({ default: module.PassportsInvalidError })));

const HelpHome = React.lazy(() => import(/* webpackPrefetch: true */ "./help/_Pages").then((module) => ({ default: module.HelpHome })));
const HelpRestorePurchases = React.lazy(() => import(/* webpackPrefetch: true */ "./help/_Pages").then((module) => ({ default: module.HelpRestorePurchases })));

let TestHome: any = null;
let TestApi: any = null;

if (process.env.REACT_APP_ENV === 'development') {
  TestHome = React.lazy(() => import("./test/_Pages").then((module) => ({ default: module.TestHome })));
  TestApi = React.lazy(() => import("./test/_Pages").then((module) => ({ default: module.TestApi })));
}

const ErrorNotFound = React.lazy(() => import(/* webpackPrefetch: true */ "./error/_Pages").then((module) => ({ default: module.ErrorNotFound })));

type Props = {};
type State = {};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    localForage.config({
      //driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
      name: 'qr-quebec',
      version: 1.0,
      size: 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName: 'data', // Should be alphanumeric, with underscores.
      description: 'QR Québec storage',
    });

    //Init storage
    initData();
  }

  componentDidMount() {
    //Update usage stats
    syncUsageStats();
  }

  render() {
    return (
      <PayPalScriptProvider options={{ 'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID || '', 'currency': 'CAD', 'locale': 'fr_CA' }}>
        <BrowserRouter>
          <nav className="navbar navbar-dark fixed-top bg-qrqc">
            <div className="container-fluid">
              <div className="navbar-brand d-flex align-items-center">
                <div className="navbar-appicon d-flex">
                  <img src={Logo} alt="Logo" width="30" height="30" />
                </div>

                <span className="navbar-apptitle ms-1">QR Québec</span>
                {process.env.REACT_APP_SUBTITLE &&
                  <span className="navbar-apptitle ms-2">({process.env.REACT_APP_SUBTITLE})</span>
                }
              </div>
            </div>
          </nav>

          <main>
            <div id="main-container">
              <ErrorBoundary>
                <Switch>
                  <Route path="/" exact>
                    <Redirect to="/presenter" />
                  </Route>

                  <Route path="/presenter" exact component={PassportsHome} />

                  <Suspense fallback={
                    <div className="d-flex flex-column align-items-center my-5 py-5 w-100">
                      <div className="spinner-border text-qrqc" role="status">
                        <span className="visually-hidden">Chargement...</span>
                      </div>

                      <div className="text-qrqc mt-3">Chargement...</div>
                    </div>
                  }>
                    <Switch>
                      <Route path="/presenter/ajouter" exact>
                        <Redirect to="/presenter/ajouter/camera" />
                      </Route>
                      <Route path="/presenter/ajouter/camera" exact component={PassportsAdd} />
                      <Route path="/presenter/confirmer" exact component={PassportsAddConfirm} />
                      <Route path="/presenter/ajouter/confirmer" exact component={PassportsAddConfirm} />
                      <Route path="/presenter/ajouter/limite" exact component={PassportsAddLimit} />
                      <Route path="/presenter/ajouter/limite/merci" exact component={PassportsAddLimitPurchased} />
                      <Route path="/presenter/qr/:uid" exact component={PassportsShow} />
                      <Route path="/presenter/qr/:uid/detail" exact component={PassportsDetail} />
                      <Route path="/presenter/invalide/format" exact component={PassportsInvalidNotShc} />
                      <Route path="/presenter/invalide/alg" exact component={PassportsInvalidAlg} />
                      <Route path="/presenter/invalide/issuer" exact component={PassportsInvalidIssuer} />
                      <Route path="/presenter/invalide/signature" exact component={PassportsInvalidSignature} />
                      <Route path="/presenter/invalide/erreur" exact component={PassportsInvalidError} />

                      <Route path="/aide" exact component={HelpHome} />
                      <Route path="/aide/recuperer" exact component={HelpRestorePurchases} />

                      {(process.env.REACT_APP_ENV === 'development') &&
                        <Route path="/test" exact component={TestHome} />
                      }
                      {(process.env.REACT_APP_ENV === 'development') &&
                        <Route path="/test/api" exact component={TestApi} />
                      }

                      <Route path="*" component={ErrorNotFound} />
                    </Switch>
                  </Suspense>
                </Switch>
              </ErrorBoundary>
            </div>

            <AppUpdatedPrompt />
          </main>

          <footer className="footer navbar-dark fixed-bottom bg-qrqc">
            <div className="container-fluid d-flex justify-content-center align-items-center">
              <NavLink aria-label="Présenter un passeport" className="footer-item" activeClassName="active" to="/presenter"><QrCodeSharp /><br />Présenter</NavLink>
              <NavLink aria-label="Aide sur QR Québec" className="footer-item" activeClassName="active" to="/aide"><HelpCircleSharp /><br />Aide</NavLink>
            </div>
          </footer>
        </BrowserRouter>
      </PayPalScriptProvider>
    );
  }
}

export default App;