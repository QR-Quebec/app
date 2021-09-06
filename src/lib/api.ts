//Libs
import { getUserUuid } from 'lib/data';

//Paypal
import { OnApproveData } from '@paypal/paypal-js/types/components/buttons'

//Types
import { ApiResponse } from 'types/ApiResponse';
import { Licence, Exists, Licences } from 'types/Licence';

export const licenceExists = async (email: string, product: string) : Promise<Exists|null> => {
  try {
    let response = await fetch(process.env.REACT_APP_API_URL + '/licence/exists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        product: product,
      })
    });

    let responseJson: ApiResponse<Exists> = await response.json();

    if (responseJson.data) {
      return responseJson.data;
    }

    return null;
  } catch (error) {
    //Do nothing
    console.error(error);
    return null;
  }
}

export const restorePurchases = async (email: string, key: string) : Promise<Licences|null> => {
  try {
    let response = await fetch(process.env.REACT_APP_API_URL + '/licence/restore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userUuid: await getUserUuid(),
        email: email,
        key: key,
      })
    });

    let responseJson: ApiResponse<Licences> = await response.json();

    if (responseJson.data) {
      return responseJson.data;
    }

    return null;
  } catch (error) {
    //Do nothing
    console.error(error);
    return null;
  }
}

export const paypalOrderInit = async (email: string|null, product: string, data: OnApproveData) => {
  try {
    await fetch(process.env.REACT_APP_API_URL + '/paypal/order/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userUuid: await getUserUuid(),
        email: email,
        product: product,
        fullData: JSON.stringify(data),
      })
    });
  } catch (error) {
    //Do nothing
    console.error(error);
  }
}

export const paypalOrderCaptured = async (email: string|null, data: any) : Promise<Licence|null> => {
  try {
    let response = await fetch(process.env.REACT_APP_API_URL + '/paypal/order/captured', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userUuid: await getUserUuid(),
        email: email,
        fullData: JSON.stringify(data),
      })
    });

    let responseJson: ApiResponse<Licence> = await response.json();

    if (responseJson.data) {
      return responseJson.data;
    }

    return null;
  } catch (error) {
    //Do nothing
    console.error(error);
    return null;
  }
}