import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

//Libs
import { canAddPassport } from 'lib/limits';

//Styles
import './AddLimit.scss';

//Images
import Cart from 'assets/img/cart.png';

//Components
import Loading from 'components/ui/Loading';
import PaypalButton from 'components/ui/PaypalButton'

//Libs
import { calcMaxPassports } from 'lib/limits';

type LocationState = {};
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = { isLimited: boolean, maxPassports: number, product: string, description: string, price: string };

class PassportsAddLimit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLimited: false,
      maxPassports: 0,
      product: 'QRQC-PASSPORT-FAMILY',
      description: 'QR Québec - Famille',
      price: '0.99',
    };
  }

  async componentDidMount() {
    //Si on a de la place, on dirige PAS vers achat
    if (await canAddPassport()) {
      this.props.history.push('/presenter');
      return;
    }

    let maxPassports = await calcMaxPassports();

    this.setState({ isLimited: true, maxPassports: maxPassports });
  }

  setProduct(product: string, description: string, price: string) {
    this.setState({ product: product, description: description, price: price });

    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  render() {
    if (!this.state.isLimited) {
      return (
        <Loading />
      );
    }

    return (
      <div className="container-fluid">
        <div className="card mt-3">
          <div className="card-header">
            Limite de passeports atteinte
          </div>

          <div className="card-body fs-6">
            { (this.state.maxPassports.toString() === process.env.REACT_APP_MAX_PASSPORTS_FREE) &&
            <div className="mb-3">
              La version gratuite de QR Québec est limitée à {this.state.maxPassports} passeports.
            </div>
            }
            { (this.state.maxPassports.toString() === process.env.REACT_APP_MAX_PASSPORTS_FAMILY) &&
            <div className="mb-3">
              La version famille de QR Québec est limitée à {this.state.maxPassports} passeports.
            </div>
            }
            { (this.state.maxPassports.toString() === process.env.REACT_APP_MAX_PASSPORTS_GROUP) &&
            <div className="mb-3">
              La version groupe de QR Québec est limitée à {this.state.maxPassports} passeports.
            </div>
            }
            { (this.state.maxPassports.toString() === process.env.REACT_APP_MAX_PASSPORTS_CROWD) &&
            <div className="mb-3">
              La version foule de QR Québec est limitée à {this.state.maxPassports} passeports.
            </div>
            }

            <div className="text-center mb-3">
              <img className="sm-img" src={Cart} alt="Panier d'achat" />
            </div>

            <div className="mb-3">
              Soutenez le développement de QR Québec en achetant l'un des bloc de
              passeports suivants:
            </div>

            <div className="form-check">
              <input className="form-check-input" type="radio" name="exampleRadios" id="passports-family" defaultChecked onClick={() => {this.setProduct('QRQC-PASSPORT-FAMILY', 'QR Québec - Famille', '0.99')}} />
              <label className="form-check-label" htmlFor="passports-family">
                <span className="text-qrqc fw-bold">Famille</span>
                <span className="text-muted">&nbsp;&bull;&nbsp;0.99$</span>

                <div className="text-muted mb-3">Stockez jusqu'a {process.env.REACT_APP_MAX_PASSPORTS_FAMILY || 0} passeports</div>
              </label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="radio" name="exampleRadios" id="passports-group" onClick={() => {this.setProduct('QRQC-PASSPORT-GROUP', 'QR Québec - Groupe', '2.99')}} />
              <label className="form-check-label" htmlFor="passports-group">
                <span className="text-qrqc fw-bold">Groupe</span>
                <span className="text-muted">&nbsp;&bull;&nbsp;2.99$</span>

                <div className="text-muted mb-3">Stockez jusqu'a {process.env.REACT_APP_MAX_PASSPORTS_GROUP || 0} passeports</div>
              </label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="radio" name="exampleRadios" id="passports-crowd" onClick={() => {this.setProduct('QRQC-PASSPORT-CROWD', 'QR Québec - Foule', '7.99')}} />
              <label className="form-check-label" htmlFor="passports-crowd">
                <span className="text-qrqc fw-bold">Foule</span>
                <span className="text-muted">&nbsp;&bull;&nbsp;7.99$</span>

                <div className="text-muted mb-3">Stockez jusqu'a {process.env.REACT_APP_MAX_PASSPORTS_CROWD || 0} passeports</div>
              </label>
            </div>

            <div className="mt-3 mb-1">
              <PaypalButton product={this.state.product} description={this.state.description} price={this.state.price} routeOnCompleted="/presenter/ajouter/limite/merci" />
            </div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default PassportsAddLimit;