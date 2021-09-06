import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { withRouter } from 'react-router-dom';

//Style
import './RestorePurchases.scss';

//Libs
import { restorePurchases } from 'lib/api';
import { syncUsageStats } from 'lib/sync';
import * as localForage from 'localforage';

//Icones

//Types
import { Licences, Licence } from 'types/Licence';

type LocationState = {};
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = { email: string, key: string, readyToValidate: boolean };

class HelpRestorePurchases extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.emailOnChange = this.emailOnChange.bind(this);
    this.isEmailValid = this.isEmailValid.bind(this);
    this.keyOnChange = this.keyOnChange.bind(this);
    this.isKeyValid = this.isKeyValid.bind(this);
    this.restorePurchases = this.restorePurchases.bind(this);

    this.state = {
      email: '',
      key: '',
      readyToValidate: false,
    };
  }

  async componentDidMount() {
    syncUsageStats();

    let email: string | null = await localForage.getItem('email');

    if (email) {
      this.setState({ email: email, readyToValidate: true });
      this.isEmailValid();
    } else {
      this.setState({ readyToValidate: false });
    }
  }

  onSubmit(event: React.FormEvent) {
    event.preventDefault();
    return false;
  }

  emailOnChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ email: event.currentTarget.value });

    this.isEmailValid();
  }

  keyOnChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ key: event.currentTarget.value });

    this.isKeyValid();
  }

  isEmailValid(): boolean {
    let emailField = document.getElementById('email-field') as HTMLInputElement;

    if (emailField) {
      if (!emailField.checkValidity()) {
        emailField.classList.remove('is-valid');
        emailField.classList.add('is-invalid');

        return false;
      }

      emailField.classList.remove('is-invalid');
      emailField.classList.add('is-valid');

      return true;
    }

    return false;
  }

  isKeyValid(): boolean {
    let keyField = document.getElementById('key-field') as HTMLInputElement;

    if (keyField) {
      if (!keyField.checkValidity()) {
        keyField.classList.remove('is-valid');
        keyField.classList.add('is-invalid');

        return false;
      }

      keyField.classList.remove('is-invalid');
      keyField.classList.add('is-valid');

      return true;
    }

    return false;
  }

  async restorePurchases() {
    if (this.isEmailValid() && this.isKeyValid()) {
      let licencesToSrestore = await restorePurchases(this.state.email, this.state.key);
      let licences: Licences = [];

      if (licencesToSrestore && licencesToSrestore.length > 0) {
        licencesToSrestore.forEach((licenceToSrestore: Licence) => {
          let newLicence = {} as Licence;
          newLicence.product = licenceToSrestore.product;
          newLicence.licence = licenceToSrestore.licence;

          licences.push(newLicence);
        });

        await localForage.setItem('licences', licences);

        alert(licences.length.toString() + ' achats récupérés avec succcès.');

        this.props.history.push('/presenter');
        return;
      } else {
        //Nothing?
        alert('Cette adresse courriel ou ce code de récupération ne sont pas valides, ou aucun achat n\'y sont associés.');
      }
    }
  }

  render() {
    return (
      <div className="container-fluid help-restore-purchases">
        <div className="card mt-3">
          <div className="card-header">
            <h2 className="help-restore-purchases--title">Récupérer mes achats</h2>
          </div>
          <div className="card-body">
            <div className="mb-3">
              Vous retrouverez ces informations dans votre courriel de confirmation d'achat.
            </div>

            <div className="mb-3">
              En cas de problème, n'hésitez pas à nous contacter à l'adresse <a href="mailto:support@kyber.studio?subject=QR Québec">support@kyber.studio</a> .
            </div>

            <form id="paypal-form" className={'needs-validation ' + (this.state.readyToValidate ? 'was-validated' : '')} noValidate onSubmit={this.onSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="email-field">
                  Adresse courriel:
                </label>
                <input id="email-field" className="form-control" type="email" required placeholder="votre-nom@fournisseur.qc.ca" value={this.state.email} onChange={this.emailOnChange} />

                <div className="valid-feedback">
                  Adresse courriel valide
                </div>

                <div className="invalid-feedback">
                  Veuillez saisir une adresse courriel valide
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="key-field">
                  Code de récupération:
                </label>
                <input id="key-field" className="form-control" type="text" maxLength={5} required placeholder="12345" value={this.state.key} onChange={this.keyOnChange} />

                <div className="valid-feedback">
                  Ce code semble valide
                </div>

                <div className="invalid-feedback">
                  Veuillez saisir un code de récupération
                </div>
              </div>
            </form>

            <button className="btn btn-qrqc w-100" onClick={this.restorePurchases}>Récupérer mes achats</button>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default withRouter(HelpRestorePurchases);