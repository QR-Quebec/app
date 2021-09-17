import React, { Component } from 'react';

//Style
import './PassportContent.scss';
import { colors } from 'consts/colors';

//Icônes
import { ReactComponent as FileContractSolid } from 'assets/svg/fontawesome-5-pro/file-contract-solid.svg';
import { ReactComponent as IdBadge } from 'assets/svg/fontawesome-5-pro/id-badge-regular.svg';
import { ReactComponent as BirthdayCake } from 'assets/svg/fontawesome-5-pro/birthday-cake-regular.svg';
import { ReactComponent as Syringe } from 'assets/svg/fontawesome-5-pro/syringe-regular.svg';
import { ReactComponent as Vial } from 'assets/svg/fontawesome-5-pro/vial-regular.svg';
import { ReactComponent as MapMarkerAlt } from 'assets/svg/fontawesome-5-pro/map-marked-alt-regular.svg';
import { ReactComponent as CalendarAlt } from 'assets/svg/fontawesome-5-pro/calendar-alt-regular.svg';
import { ReactComponent as NotesMedical } from 'assets/svg/fontawesome-5-pro/notes-medical-regular.svg';
import { ReactComponent as FileSignature } from 'assets/svg/fontawesome-5-pro/file-signature-regular.svg';
import { ReactComponent as CalendarCheck } from 'assets/svg/fontawesome-5-pro/calendar-check-regular.svg';

//Components
import Loading from 'components/ui/Loading';
import ErrorMissingState from 'components/pages/errors/ErrorMissingState';

//Libs
import { decodeSHC } from 'lib/shc';
import { formatLongDate, formatAgo, formatGender, formatVaccine, formatTestResult, formatIssuer, formatShortTime } from 'lib/format';

//Types
import { PassportData, PassportDataDose, PassportDataTestResult } from 'types/PassportData';

type Props = { qrData: string | Array<string> };
type State = { passportData: PassportData };

class PassportContent extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      passportData: {} as PassportData,
    };
  }

  async componentDidMount() {
    let passportData: PassportData = JSON.parse(await decodeSHC(this.props.qrData));
    this.setState({ passportData: passportData });
  }

  render() {
    if (!this.props || !this.props.qrData) {
      return (
        <div className="container-fluid">
          <ErrorMissingState message="props.qrData" />
        </div>
      );
    }

    if (!this.state.passportData.loaded) {
      return (
        <Loading />
      );
    }

    if (!this.state.passportData) {
      return (
        <ErrorMissingState message="state.passportData" />
      );
    }

    return (
      <div>
        <div className="alert alert-great-success passport-content--header mt-3" role="alert">
          <FileContractSolid className="me-2" height="24px" width="24px" color={colors.active} />
          Cette preuve est authentique
        </div>

        <div className="mt-2">
          Identification:
        </div>

        <ol className="list-group mt-2">
          <li className="list-group-item d-flex align-items-center">
            <div className="me-3">
              <IdBadge height="36px" width="36px" color={colors.qrqc} />
            </div>

            <div className="flex-fill d-flex flex-column">
              <div className="passport-content--title">{this.state.passportData.patient.names[0].toLocaleUpperCase()}</div>

              {this.state.passportData.patient.names.slice(1).map((name, i) => {
                return (
                  <div key={'name-'+i.toString()} className="passport-content--subtitle">{name.toLocaleUpperCase()}</div>
                );
              })}
            </div>
          </li>

          <li className="list-group-item d-flex align-items-center">
            <div className="me-3">
              <BirthdayCake height="36px" width="36px" color={colors.qrqc} />
            </div>


            <div className="flex-fill d-flex flex-column">
                <div className="passport-content--title">{formatLongDate(this.state.passportData.patient.birthDate)}</div>

                <div className="passport-content--subtitle">Sexe: {formatGender(this.state.passportData.patient.gender)}</div>
            </div>
          </li>
        </ol>

        {this.state.passportData.doses.map((dose: PassportDataDose , i: number) => {
          return (
            <div key={'dose-'+i.toString()} className="mt-2">
              Dose { dose.doseNumber }:

              <ol className="list-group mt-2">
                <li className="list-group-item d-flex align-items-center">
                  <div className="passport-content--badged-image me-3">
                    <Syringe height="36px" width="36px" color={colors.qrqc} />
                    <span className="badge rounded-pill bg-qrqc passport-content--badged-image-badge">{ dose.doseNumber }</span>
                  </div>

                  <div className="flex-fill d-flex flex-column">
                    <div className="passport-content--title">{formatVaccine(dose.vaccineCode)}</div>
                    <div className="passport-content--subtitle">Lot: {dose.vaccineLot}</div>
                  </div>
                </li>

                <li className="list-group-item d-flex align-items-center">
                  <div className="me-3">
                    <CalendarAlt height="36px" width="36px" color={colors.qrqc} />
                  </div>

                  <div className="flex-fill d-flex flex-column">
                    <div className="passport-content--title">Reçue le {formatLongDate(dose.date)}</div>
                    <div className="passport-content--subtitle">Il y a {formatAgo(dose.daysAgo)}</div>
                  </div>
                </li>

                <li className="list-group-item d-flex align-items-center">
                  <div className="me-3">
                    <MapMarkerAlt height="36px" width="36px" color={colors.qrqc} />
                  </div>

                  <div className="flex-fill d-flex flex-column">
                    <div className="passport-content--title">{dose.location}</div>
                    <div className="passport-content--subtitle">Notes: {dose.notes}</div>
                  </div>
                </li>
              </ol>
            </div>
          );
        })}

        {this.state.passportData.testResults.map((testResult: PassportDataTestResult , i: number) => {
          return (
            <div key={'result-'+i.toString()} className="mt-2">
              Résultats de tests:
              <ol className="list-group mt-2">
                <li className="list-group-item d-flex align-items-center">
                  <div className="passport-content--badged-image me-3">
                    <Vial height="36px" width="36px" color={colors.qrqc} />
                  </div>

                  <div className="flex-fill d-flex flex-column">
                    <div className="passport-content--title">Type: {testResult.diagnosticCode}</div>
                    <div className="passport-content--subtitle"></div>
                  </div>
                </li>

                <li className="list-group-item d-flex align-items-center">
                  <div className="me-3">
                    <CalendarAlt height="36px" width="36px" color={colors.qrqc} />
                  </div>

                  <div className="flex-fill d-flex flex-column">
                    <div className="passport-content--title">Testé le {testResult.testDate ? formatLongDate(testResult.testDate) : 'Inconnue'}</div>
                    <div className="passport-content--subtitle">Il y a {formatAgo(testResult.testDaysAgo)}</div>
                  </div>
                </li>

                <li className="list-group-item d-flex align-items-center">
                  <div className="passport-content--badged-image me-3">
                    <NotesMedical height="36px" width="36px" color={colors.qrqc} />
                  </div>

                  <div className="flex-fill d-flex flex-column">
                    <div className="passport-content--title">Résultat: {formatTestResult(testResult.result)}</div>
                    <div className="passport-content--subtitle"></div>
                  </div>
                </li>

                <li className="list-group-item d-flex align-items-center">
                  <div className="me-3">
                    <CalendarAlt height="36px" width="36px" color={colors.qrqc} />
                  </div>

                  <div className="flex-fill d-flex flex-column">
                    <div className="passport-content--title">Reçu le {testResult.resultDate ? formatLongDate(testResult.resultDate) : 'Inconnue'}</div>
                    <div className="passport-content--subtitle">Il y a {formatAgo(testResult.resultDaysAgo)}</div>
                  </div>
                </li>
              </ol>
            </div>
          );
        })}

        <div>
          <div className="mt-2">
            Signature numérique:
          </div>

          <ol className="list-group mt-2 mb-5">
            <li className="list-group-item d-flex align-items-center">
              <div className="me-3">
                <FileSignature height="36px" width="36px" color={colors.qrqc} />
              </div>

              <div className="flex-fill d-flex flex-column">
                <div className="passport-content--title">{formatIssuer(this.state.passportData.signature.issuer)}</div>
                <div className="passport-content--subtitle">{this.state.passportData.signature.issuer}</div>
              </div>
            </li>

            {this.state.passportData.signature.issuedAt &&
              <li className="list-group-item d-flex align-items-center">
                <div className="me-3">
                  <CalendarCheck height="36px" width="36px" color={colors.qrqc} />
                </div>

                <div className="flex-fill d-flex flex-column">
                  <div className="passport-content--title">Signée le {formatLongDate(this.state.passportData.signature.issuedAt)}</div>
                  <div className="passport-content--subtitle">Signée à {formatShortTime(this.state.passportData.signature.issuedAt)}</div>
                </div>
              </li>
            }
          </ol>
        </div>

        <br />
      </div>
    );
  }
}

export default PassportContent;