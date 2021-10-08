import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//Version
import * as PackageJson from '../../../package.json';

//Style
import './Home.scss';
import { colors } from 'consts/colors';

//Icones
import LogoKyber from 'assets/img/kyber_studio.png';
import { ReactComponent as LinkIcon } from 'assets/svg/fontawesome-5-pro/link-solid.svg';
import { ReactComponent as EmailIcon } from 'assets/svg/fontawesome-5-pro/envelope-regular.svg';

//Components
import PaypalButton from 'components/ui/PaypalButton'

type Props = {};
type State = { price: string };

class HelpHome extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      price: '0.99',
    };
  }

  render() {
    return (
      <div className="container-fluid help-home">
        <div className="card mt-3">
          <div className="card-header">
            <h2 className="help-home--title">QR Québec <small>&bull; Version {PackageJson.version}</small></h2>
          </div>

          <div className="card-body">
            <div className="text-center">
              Une app fièrement Québécoise par:
            </div>

            <div className="text-center mt-3">
              <a href="https://kyber.studio" target="_blank" rel="noreferrer">
                <img className="help-home--ks" src={LogoKyber} alt="Kyber Studio" />
              </a>
            </div>

            <div className="mt-3">
              <LinkIcon className="help-home--icon" height="16px" width="16px" color={colors.qrqc} />
              <a href="https://qr-quebec.com/docs/fr/conditions-d-utilisation/" target="_blank" rel="noreferrer">Condition d'utilisation</a>
            </div>

            <div className="mt-1">
              <LinkIcon className="help-home--icon" height="16px" width="16px" color={colors.qrqc} />
              <a href="https://qr-quebec.com/docs/fr/politique-de-confidentialite/" target="_blank" rel="noreferrer">Politique de confidentialité</a>
            </div>

            <div className="mt-3">
              * Non affilié au Gouvernement du Québec.
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-header">
            <h2 className="help-home--title">Support</h2>
          </div>
          <div className="card-body">
            <div className="mt-1">
              <EmailIcon className="help-home--icon" height="16px" width="16px" color={colors.qrqc} />
              Courriel&nbsp;:&nbsp;
              <a href="mailto:support@kyber.studio?subject=QR Québec">support@kyber.studio</a>
            </div>

            <div className="mt-1">
              <LinkIcon className="help-home--icon" height="16px" width="16px" color={colors.qrqc} />
              Web&nbsp;:&nbsp;
              <a href="https://support.kyber.studio" target="_blank" rel="noreferrer">https://support.kyber.studio</a>
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-header">
            <h2 className="help-home--title">Don</h2>
          </div>
          <div className="card-body">
            <div className="mt-1">
              Si vous avez réinstallé cette app ou vidé votre stockage, cliquez sur le bouton ci-dessous pour récupérer vos achats.
            </div>

            <div className="mt-3 mb-1">
              <PaypalButton description="Don" price={this.state.price} routeOnCompleted="/aide/merci" />
            </div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default HelpHome;