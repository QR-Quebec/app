import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { Link } from 'react-router-dom';

//Style
import './Home.scss';
import { colors } from 'consts/colors';

//Icônes
import { QrCodeOutline } from 'react-ionicons';
import { ReactComponent as PlusRegular } from 'assets/svg/fontawesome-5-pro/plus-regular.svg';
import { ReactComponent as CodeRegular } from 'assets/svg/fontawesome-5-pro/code-regular.svg';
import { ReactComponent as GripLinesSolid } from 'assets/svg/fontawesome-5-pro/grip-lines-solid.svg';

//Libs
import { List } from 'react-movable';

//Types
import { PassportList } from 'types/PassportList';

//Data
import { getPassports, swapPassport } from 'lib/data';


type LocationState = {};
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = { passports: PassportList, loaded: boolean };

class PassportsHome extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      passports: [],
      loaded: false,
    };
  }

  async componentDidMount() {
    let passports: PassportList = await getPassports();

    this.setState({ passports: passports, loaded: true });
  }

  render() {
    return (
      <div className={(this.state.loaded && this.state.passports.length === 0 ? "passports-home--empty" : "") + " container-fluid"}>
        {this.state.loaded && this.state.passports.length === 0 &&
          <div className="passports-home--empty-text">
            Cliquez sur  + pour ajouter une preuve de vaccination !
          </div>
        }

        {this.state.passports.length > 0 &&
          <div className="mt-3">
            <List
              values={this.state.passports}
              onChange={async ({ oldIndex, newIndex }) => {
                await swapPassport(oldIndex, newIndex);

                let sortedPassports = await getPassports();

                this.setState({ passports: sortedPassports })
              }}
              renderList={({ children, props }) => {
                return (
                  <ol {...props} className="list-group mt-2">
                    {children}
                  </ol>
                )
              }}
              renderItem={({ value, props }) => {
                return (
                  <div {...props} className="list-group-item list-group-item-action d-flex align-items-center no-select" key={'passport-'+value.uid.toString()} onClick={ () => { this.props.history.push('/presenter/qr/'+value.uid) }}>
                    <div className="me-3">
                      <QrCodeOutline height="48px" width="48px" color={colors.qrqc} />
                    </div>

                    <div className="flex-fill">
                      <div className="passport-home--name">{value.name.toLocaleUpperCase()}</div>
                    </div>

                    <div className="d-flex justify-content-center align-items-center align-self-stretch" style={{ width: '24px' }} data-movable-handle>
                      <GripLinesSolid height="16px" width="16px" color={colors.disabled} />
                    </div>
                  </div>
                )
              }}
            />
            <br />
          </div>
      }

        <Link to="/presenter/ajouter">
          <button aria-label="Ajouter une preuve de vaccination" type="button" className="btn btn-qrqc btn-fab btn-fab-1st"><PlusRegular height="32px" width="32px" color={colors.active} /></button>
        </Link>

        {process.env.REACT_APP_ENV === 'development' &&
          <Link to="/test">
            <button aria-label="Test" type="button" className="btn btn-qrqc btn-fab btn-fab-2nd"><CodeRegular height="32px" width="32px" color="red" /></button>
          </Link>
        }
      </div>
    );
  }
}

export default PassportsHome;