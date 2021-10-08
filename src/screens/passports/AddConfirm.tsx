import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { Link } from 'react-router-dom';

//Styles
import { colors } from 'consts/colors';

//Icônes
import { ReactComponent as CheckRegular } from 'assets/svg/fontawesome-5-pro/check-regular.svg';
import { ReactComponent as TimesRegular } from 'assets/svg/fontawesome-5-pro/times-regular.svg';

//Composantes
import PassportContent from 'components/pages/PassportContent';
import Loading from 'components/ui/Loading';
import ErrorMissingState from 'components/pages/errors/ErrorMissingState';

//Libs
import { decodeSHC } from 'lib/shc';

//Types
import { PassportData } from 'types/PassportData';

//Data
import { passportExists, addPassport } from 'lib/data';

type LocationState = { qrData: string | Array<string> };
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = { passportData: PassportData };

class PassportsAddConfirm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      passportData: {} as PassportData,
    };

    this.addPassport = this.addPassport.bind(this);
  }

  async componentDidMount() {
    if (this.props.location.state && this.props.location.state.qrData) {
      let passportData = JSON.parse(await decodeSHC(this.props.location.state.qrData));

      this.setState({ passportData: passportData });
    }
  }

  async addPassport() {
    if (await passportExists(this.props.location.state.qrData)) {
      alert('Cette preuve de vaccination est déjà stockée dans QR Québec.');

      return;
    }

    await addPassport(this.state.passportData.patient.names[0], this.props.location.state.qrData);

    this.props.history.push('/presenter');
  }

  render() {
    if (!this.props.location.state || !this.props.location.state.qrData) {
      return (
        <div className="container-fluid">
          <ErrorMissingState message="location.state.qrData" />
        </div>
      );
    }

    if (!this.state.passportData.loaded) {
      return (
        <div className="container-fluid">
          <Loading />
        </div>
      );
    }

    if (!this.state.passportData) {
      return (
        <div className="container-fluid">
          <ErrorMissingState message="state.passportData" />
        </div>
      );
    }

    return (
      <div className="container-fluid">
        <PassportContent qrData={this.props.location.state.qrData} />

        <button aria-label="Ajouter cette preuve de vaccination" type="button" className="btn btn-qrqc btn-fab btn-fab-right-1st" onClick={this.addPassport}><CheckRegular height="28px" width="28px" color={colors.active} /></button>

        <Link to="/presenter">
          <button aria-label="Ne pas ajouter cette preuve de vaccination" type="button" className="btn btn-qrqc btn-fab btn-fab-right-2nd"><TimesRegular height="28px" width="28px" color={colors.active} /></button>
        </Link>
      </div>
    );
  }
}

export default PassportsAddConfirm;