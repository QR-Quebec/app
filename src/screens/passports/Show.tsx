import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { Link } from 'react-router-dom';

//Style
import './Show.scss';
import { colors } from 'consts/colors';

//Icônes
import { ReactComponent as FileContractSolid } from 'assets/svg/fontawesome-5-pro/file-contract-solid.svg';
import { ReactComponent as PageBreakRegular } from 'assets/svg/fontawesome-5-pro/page-break-regular.svg';
import Logo from 'assets/svg/icon.svg';
import { ReactComponent as InfoCircleRegular } from 'assets/svg/fontawesome-5-pro/info-circle-regular.svg';

//Components
import * as QRCode from 'qrcode';
import Loading from 'components/ui/Loading';
import ErrorPageNotFound from 'components/pages/errors/ErrorPageNotFound';
import ErrorMissingState from 'components/pages/errors/ErrorMissingState';
import { Button, Modal } from 'react-bootstrap';

//Libs
import { decodeSHC } from 'lib/shc';

//Types
import { PassportData } from 'types/PassportData';
import { PassportListItem } from 'types/PassportList';

//Data
import { getPassports } from 'lib/data';

type LocationState = {};
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = {
  passport: PassportListItem,
  passportNotFound: boolean,
  loaded: boolean,
  passportData: PassportData,
  qrData: string | Array<string>,
  qrImgUrl: string | Array<string>,
  showSplitInfo: boolean,
};

class PassportsShow extends Component<Props, State> {
  resizeTimer: any;

  constructor(props: Props) {
    super(props);

    this.resizeTimer = null;

    this.state = {
      passport: {} as PassportListItem,
      passportNotFound: false,
      loaded: false,
      passportData: {} as PassportData,
      qrData: '',
      qrImgUrl: '',
      showSplitInfo: false,
    };

    this.handleResize = this.handleResize.bind(this);
    this.redrawQR = this.redrawQR.bind(this);
    this.splitQR = this.splitQR.bind(this);
    this.openSplitInfo = this.openSplitInfo.bind(this);
    this.splitInfoClosed = this.splitInfoClosed.bind(this);
  }

  async componentDidMount() {
    let passports = await getPassports();
    let passportsFiltered = passports.filter((passport) => { return passport.uid === this.props.match.params['uid']});

    if (passportsFiltered && (passportsFiltered.length >= 1)) {
      let passport = passportsFiltered[0];
      let passportData = JSON.parse(await decodeSHC(passport.qrData));

      this.setState({
        passport: passport,
        passportNotFound: false,
        loaded: true,
        qrData: passport.qrData,
        passportData: passportData,
      });

      this.redrawQR();
    } else {
      this.setState({
        passportNotFound: true,
        loaded: true,
      });
    }

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  }

  redrawQR() {
    const doRedrawQR = async () => {
      let qrImgUrl: string | Array<string> | null = null;

      if (Array.isArray(this.state.qrData)) {
        qrImgUrl = await Promise.all(this.state.qrData.map(async (qrData): Promise<string> => {
          return await doRedrawOneQR(qrData, true);
        }));
      } else {
        qrImgUrl = await doRedrawOneQR(this.state.qrData, false);
      }

      if (qrImgUrl) {
        this.setState({ qrImgUrl: qrImgUrl });
      }
    }

    const doRedrawOneQR = async (qrData: string, multiQR: boolean): Promise<string> => {
      if (window.innerWidth <= window.innerHeight) {
        //Portrait
        return await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'L', margin: 0, width: window.innerWidth * 0.9 });
      }

      //Paysage
      return await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'L', margin: 0, width: ((window.innerHeight - 65 - 90 - (multiQR ? 24 : 0)) * 0.9) - 5 });
    }

    doRedrawQR();
  }

  handleResize() {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = setTimeout(this.redrawQR, 250);
  }

  splitQR() {
    if (Array.isArray(this.state.qrData)) {
      return;
    }

    if(!this.state.qrData.startsWith('shc:/')) {
      return;
    }

    let data = this.state.qrData.substring(5);

    if(data.indexOf('/') !== -1) {
      return;
    }

    let split = data.length / 2;
    if(split % 2 !== 0) {
      split++;
    }

    this.setState({
      qrData: [
        'shc:/1/2/'+data.substring(0, split),
        'shc:/2/2/'+data.substring(split),
      ],
      showSplitInfo: false,
    });

    setTimeout(() => {
      this.redrawQR();

      window.scrollTo({ top: 0 });
    }, 0);
  }

  openSplitInfo() {
    this.setState({
      showSplitInfo: true,
    });
  }

  splitInfoClosed() {
    this.setState({
      showSplitInfo: false,
    });
  }

  render() {
    if (!this.state.loaded) {
      return (
        <div className="container-fluid">
          <Loading />
        </div>
      );
    }

    if (this.state.loaded && this.state.passportNotFound) {
      return (
        <div className="container-fluid">
          <ErrorPageNotFound />
        </div>
      );
    }

    if (this.state.loaded && !this.state.passport) {
      return (
        <div className="container-fluid">
          <ErrorMissingState message="state.passport" />
        </div>
      );
    }

    if (this.state.loaded &&!this.state.passportData) {
      return (
        <div className="container-fluid">
          <ErrorMissingState message="state.passportData" />
        </div>
      );
    }

    return (
      <div className="container-fluid passport-show--container">
        <div>
          {!Array.isArray(this.state.qrImgUrl) &&
            <img className="passport-show--qr" src={this.state.qrImgUrl} alt="Code QR" />
          }

          {Array.isArray(this.state.qrImgUrl) && this.state.qrImgUrl.map((qrImgUrl: string, i: number) => {
            return (
              <div key={'qr-'+i.toString()}>
                <img className="passport-show--qr" src={qrImgUrl} alt={'Code QR #'+i.toString()} />
                <div className="text-center">
                  Code {i+1} de {this.state.qrImgUrl.length}
                </div>
              </div>
            );
          })}
        </div>

        <div className="passport-show--info mb-3">
            <div className="passport-show--name">{this.state.passportData.patient.names[0].toLocaleUpperCase()}</div>

          <div className="passport-show--verified">
            <FileContractSolid className="me-1" height="24px" width="24px" />
            Cette preuve est authentique
          </div>
          <Modal
              centered
              show={this.state.showSplitInfo}
              onHide={this.splitInfoClosed}
          >
              <Modal.Header closeButton>
                  <Modal.Title>Diviser un code QR</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                  <p>
                    Si l'écran de votre appareil est petit ou si la caméra du validateur n'a pas une bonne résolution, ce code peut être difficile à valider.
                  </p>
                  <p>
                    Vous pouvez diviser ce code QR en deux codes QR distincts qui seront beaucoup plus facile à faire valider, tout en restant 100% officiels.
                  </p>

                  <div className="text-center mt-3">
                    <button type="button" className="btn btn-qrqc" onClick={this.splitQR}>
                      <PageBreakRegular className="align-middle me-2" height="20px" width="20px" />
                      Diviser ce code QR en deux
                    </button>
                  </div>
              </Modal.Body>

              <Modal.Footer>
                  <Button variant="secondary" onClick={this.splitInfoClosed}>Fermer</Button>
              </Modal.Footer>
          </Modal>

          {!Array.isArray(this.state.qrImgUrl) &&
            <div className="mt-3">
              <div className="fs-6">
                <div>
                  Vous avez des difficultés à faire valider ce code QR ?
                </div>
                <div className="text-center mt-2">
                  <button type="button" className="btn btn-qrqc" onClick={this.openSplitInfo}>
                    <img src={Logo} className="align-middle" alt="Logo" width="28" height="28" />
                    Diviser ce code QR en deux
                  </button>
                </div>
              </div>

              <hr className="mt-4 mb-3"/>
            </div>
          }

          <div className="text-center mt-4">
            <Link to={{ pathname: '/presenter/qr/'+this.state.passport.uid+'/detail' }}>
              <button type="button" className="btn btn-qrqc">
                <InfoCircleRegular className="align-middle me-2" height="24px" width="24px" color={colors.active} />
                Détails de la preuve de vaccination
              </button>
            </Link>
          </div>
        </div>


      </div>
    );
  }
}

export default PassportsShow;