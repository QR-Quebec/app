//Libs
import { getUserUuid, getPassportCount } from 'lib/data';

//Version
import * as PackageJson from '../../package.json';

export const syncUsageStats = async () => {
  try {
    await fetch(process.env.REACT_APP_SYNC_URL + '/usage/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userUuid: await getUserUuid(),
        appVersion: PackageJson.version,
        userAgent: navigator.userAgent,
        passportCount: await getPassportCount(),
      })
    });
  } catch (error) {
    //Do nothing
    console.error(error);
  }
}
