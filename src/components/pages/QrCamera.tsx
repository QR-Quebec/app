import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { withRouter } from 'react-router-dom';

//Styles
import './QrCamera.scss';
import { colors } from 'consts/colors';

//Icônes
import { ReactComponent as CheckRegular } from 'assets/svg/fontawesome-5-pro/check-regular.svg';
import { ReactComponent as TimesRegular } from 'assets/svg/fontawesome-5-pro/times-regular.svg';
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
  chunks: Array<string>;
};

class QrCamera extends Component<Props, State> {
  private videoElement: HTMLVideoElement | undefined | null;
  private qrScanner: QrScanner | undefined;
  private facingMode: string = 'environment';
  private forceStop: boolean = false;
  private stream: MediaProvider | null = null;

  constructor(props: Props) {
    super(props);

    QrScanner.WORKER_PATH = QrScannerWorkerPath;

    this.startScan = this.startScan.bind(this);
    this.stopScan = this.stopScan.bind(this);
    this.changeFacingMode = this.changeFacingMode.bind(this);
    this.toggleTorch = this.toggleTorch.bind(this);
    this.scanResult = this.scanResult.bind(this);
    this.scanError = this.scanError.bind(this);

    this.state = {
      hasTorch: false,
      isTorchOn: false,
      chunks: [],
    };
  }

  async componentDidMount() {
    this.videoElement = document.querySelector<HTMLVideoElement>('.webcam-container > video');

    if (this.qrScanner) {
      this.qrScanner.stop();
      this.qrScanner.destroy();
      this.qrScanner = undefined;
    }

    if (this.videoElement) {
      this.qrScanner = new QrScanner(this.videoElement, this.scanResult, this.scanError, undefined, this.facingMode);

      await this.startScan();
    }
  }

  async componentWillUnmount() {
    this.forceStop = true;
    await this.stopScan();
  }

  async startScan() {
    if (this.qrScanner) {
      await this.qrScanner.start();
    }

    if (this.forceStop && this.videoElement) {
      let tracks = (this.videoElement.srcObject as MediaStream).getTracks();
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

  async stopScan() {
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

  async scanResult(scannedData: string) {
    let qrData: string | Array<string>;

    //this.qrScanner?.stop();
    //this.qrScanner?.destroy();
    //this.qrScanner = undefined;

    if (scannedData) {
      qrData = scannedData;

      try {
        if (qrData && qrData.startsWith('shc:/')) {
          const shcData = qrData.substr(5);
          const shcParts = shcData.split('/');

          //Codes QR chunké ?
          if (shcParts.length === 3) {
            let shcPartNum: number = Number.parseInt(shcParts[0]);
            let shcPartCount: number = Number.parseInt(shcParts[1]);

            //Taille différente, on reset les chunks
            if (shcPartCount !== this.state.chunks.length) {
              let newChunks = Array(shcPartCount).fill('');

              this.setState({
                chunks: newChunks,
              });
            }

            //Placer le data dans le chunk
            let newChunks = this.state.chunks;

            newChunks[shcPartNum-1] = qrData;

            this.setState({
              chunks: newChunks,
            });

            //Vérifier si on a tous les chunks
            if (newChunks.filter(String).length < newChunks.length) {
              //Il y a des vides, on continue de scanner
              return;
            }

            //On a tous les morceaux, on réassemble
            qrData = newChunks;
          }
        } else {
          this.props.history.push(this.props.routeOnNotShc, { qrData: qrData.substring(0, 200) });
          return;
        }

        //Arrêter de scanner
        this.qrScanner?.stop();
        this.qrScanner?.destroy();
        this.qrScanner = undefined;

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

        {this.state.chunks.length > 1 &&
          <div className="webcam-chunks">
            {this.state.chunks.map((chunk, index) => {
              return (
                <h2 key={'chunk-'+index.toString()}>
                  <span className={"badge " + (!chunk ? "bg-secondary" : "bg-success")}>
                    {chunk &&
                      <CheckRegular className="me-2" height="18px" width="18px" color={colors.active} />
                    }
                    {!chunk &&
                      <TimesRegular className="me-2" height="20px" width="20px" color={colors.active} />
                    }
                    {index+1} de {this.state.chunks.length}
                  </span>
                </h2>
              );
            })}
          </div>
        }

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