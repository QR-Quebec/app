import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { withRouter } from 'react-router-dom';

//Styles
import './QrCamera.scss';
import { colors } from 'consts/colors';

//Icônes
import { ReactComponent as SyncAltRegular } from 'assets/svg/fontawesome-5-pro/sync-alt-regular.svg';
import { ReactComponent as LightbulbOnRegular } from 'assets/svg/fontawesome-5-pro/lightbulb-on-regular.svg';
import { ReactComponent as LightbulbOffRegular } from 'assets/svg/fontawesome-5-pro/lightbulb-slash-regular.svg';

//Images
import ViewFinder from 'assets/img/viewfinder.png';

//Components
import QrScanner from 'qr-scanner';
// eslint-disable-next-line import/no-webpack-loader-syntax
import QrScannerWorkerPath from '!!file-loader!../../../node_modules/qr-scanner/qr-scanner-worker.min.js';

//Libs
import { decodeSHC } from 'lib/shc';

type LocationState = {};
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {
  routeOnValid: string,
  routeOnNotShc: string,
  routeOnWrongAlg: string,
  routeOnWrongIssuer: string,
  routeOnInvalidSignature: string,
  routeOnError: string,
};
type State = {
  hasTorch: boolean;
  isTorchOn: boolean;
};

class QrCamera extends Component<Props, State> {
  private qrScanner: QrScanner | undefined;
  private facingMode: string = 'environment';
  private forceStop: boolean = false;
  private stream: MediaProvider | null = null;

  constructor(props: Props) {
    super(props);

    QrScanner.WORKER_PATH = QrScannerWorkerPath;

    this.changeFacingMode = this.changeFacingMode.bind(this);
    this.toggleTorch = this.toggleTorch.bind(this);
    this.scanResult = this.scanResult.bind(this);
    this.scanError = this.scanError.bind(this);

    this.state = {
      hasTorch: false,
      isTorchOn: false,
    };
  }

  async componentDidMount() {
    const videoElement = document.querySelector<HTMLVideoElement>('.webcam-container > video');

    if (this.qrScanner) {
      this.qrScanner.stop();
      this.qrScanner.destroy();
      this.qrScanner = undefined;
    }

    if (videoElement) {
      this.qrScanner = new QrScanner(videoElement, this.scanResult, this.scanError, undefined, this.facingMode);

      await this.qrScanner.start();

      if (this.forceStop) {
        let tracks = (videoElement.srcObject as MediaStream).getTracks();
        tracks.forEach(function (track) {
          track.stop();
        });
      }

      if (this.qrScanner) {
        this.setState({
          hasTorch: await this.qrScanner.hasFlash(),
          isTorchOn: this.qrScanner.isFlashOn(),
        });
      }
    }
  }

  componentWillUnmount() {
    this.forceStop = true;

    this.qrScanner?.stop();
    this.qrScanner?.destroy();
    this.qrScanner = undefined;
  }

  async changeFacingMode() {
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';

    if (this.qrScanner) {
      await this.qrScanner.setCamera(this.facingMode);

      this.setState({
        hasTorch: await this.qrScanner.hasFlash(),
        isTorchOn: this.qrScanner.isFlashOn(),
      });
    }
  }

  toggleTorch() {
    let newState = !this.state.isTorchOn;
    this.setState({ isTorchOn: newState });

    if (newState) {
      this.qrScanner?.turnFlashOn();
    } else {
      this.qrScanner?.turnFlashOff();
    }
  }

  async scanResult(qrData: string) {
    this.qrScanner?.stop();
    this.qrScanner?.destroy();
    this.qrScanner = undefined;

    if (qrData) {
      try {
        //Valider mais ne nas garder le résultat
        try {
          //Décoder/valider
          await decodeSHC(qrData);

          this.props.history.push(this.props.routeOnValid, { qrData: qrData });
          return;
        }
        catch (err: any) {
          if (err.message.startsWith('not_shc:')) {
            this.props.history.push(this.props.routeOnNotShc, { qrData: err.message.replace('not_shc:', '') });
            return;
          }

          if (err.message.startsWith('wrong_alg:')) {
            this.props.history.push(this.props.routeOnWrongAlg, { alg: err.message.replace('wrong_alg:', '') });
            return;
          }

          if (err.message.startsWith('wrong_issuer:')) {
            this.props.history.push(this.props.routeOnWrongIssuer, { issuer: err.message.replace('wrong_issuer:', '') });
            return;
          }

          if (err.message.startsWith('invalid_signature:')) {
            this.props.history.push(this.props.routeOnInvalidSignature, { message: err.message.replace('invalid_signature:', '') });
            return;
          }

          this.props.history.push(this.props.routeOnError, { message: err.message });
          return;
        }

      }
      catch (err: any) {
        this.props.history.push(this.props.routeOnError, { message: err.message });
        return;
      }
    }
  }

  scanError(error) {
    if (error === 'No QR code found') {
      return;
    }

    //TODO cas a gérer ?
    console.error(error);
  }

  render() {
    return (
      <div className="webcam-container">
        <img className="webcam-viewfinder" src={ViewFinder} alt="Viseur" />

        <video></video>

        <button aria-label="Changer de caméra" type="button" className="btn btn-qrqc btn-fab btn-fab-1st" onClick={this.changeFacingMode}>
          <SyncAltRegular height="26px" width="26px" color={colors.active} />
        </button>

        {this.state.hasTorch &&
          <button aria-label="Allumer la lampe" type="button" className="btn btn-qrqc btn-fab btn-fab-2nd" onClick={this.toggleTorch}>
            {!this.state.isTorchOn &&
              <LightbulbOnRegular height="32px" width="32px" color={colors.active} />
            }
            {this.state.isTorchOn &&
              <LightbulbOffRegular height="32px" width="32px" color={colors.active} />
            }
          </button>
        }
      </div>
    );
  }
}

export default withRouter(QrCamera);