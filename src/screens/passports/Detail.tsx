import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

//Styles
import { colors } from 'consts/colors';

//Icônes
import { ReactComponent as TrashRegular } from 'assets/svg/fontawesome-5-pro/trash-regular.svg';

//Composantes
import Loading from 'components/ui/Loading';
import PassportContent from 'components/pages/PassportContent';
import ErrorPageNotFound from 'components/pages/errors/ErrorPageNotFound';
import ErrorMissingState from 'components/pages/errors/ErrorMissingState';

//Types
import { PassportListItem } from 'types/PassportList';

//Data
import { getPassports, deletePassport } from 'lib/data';

type LocationState = {};
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = { passport: PassportListItem, passportNotFound: boolean, loaded: boolean };

class PassportsDetail extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      passport: {} as PassportListItem,
      passportNotFound: false,
      loaded: false,
    };

    this.delPassport = this.delPassport.bind(this);
  }

  async componentDidMount() {
    let passports = await getPassports();
    let passportsFiltered = passports.filter((passport: PassportListItem) => { return passport.uid === this.props.match.params['uid']});

    if (passportsFiltered && (passportsFiltered.length >= 1)) {
      let passport = passportsFiltered[0];

      this.setState({
        passport: passport,
        passportNotFound: false,
        loaded: true,
      });
    } else {
      this.setState({
        passportNotFound: true,
        loaded: true,
      });
    }
  }

  async delPassport() {
    if (!window.confirm('Êtes-vous certain de vouloir supprimer cette preuve de vaccination ?')) {
      return;
    }

    await deletePassport(this.state.passport.uid);

    this.props.history.push('/presenter');
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

    if (this.state.loaded && (!this.state.passport || !this.state.passport.qrData)) {
      return (
        <div className="container-fluid">
          <ErrorMissingState message="state.passport.qrData" />
        </div>
      );
    }

    return (
      <div className="container-fluid">
        <PassportContent qrData={this.state.passport.qrData} />

        <div className="text-center mt-0 mb-3">
            <button type="button" className="btn btn-qrqc" onClick={this.delPassport}>
              <TrashRegular className="align-middle me-2" height="24px" width="24px" color={colors.active} />
              Supprimer cette preuve de vaccination
            </button>
          </div>
      </div>
    );
  }
}

export default PassportsDetail;