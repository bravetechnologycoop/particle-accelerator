import axios from 'axios'
import { aws4Interceptor } from 'aws4-axios'

const awsRegion = process.env.REACT_APP_AWS_REGION
const awsService = 'iotwireless'
const awsDeviceDestination = process.env.REACT_APP_AWS_DEVICE_DESTINATION
const awsDeviceType = 'LoRaWAN'
const awsAppEUI = process.env.REACT_APP_AWS_APP_EUI
const awsAppKeyPostfix = process.env.REACT_APP_AWS_APP_KEY_POSTFIX

const awsAccessKeyID = process.env.REACT_APP_AWS_ACCESS_KEY_DEV
const awsSecretKey = process.env.REACT_APP_AWS_SECRET_KEY_DEV
const awsDeviceProfileID = process.env.REACT_APP_AWS_DEVICE_PROFILE_ID_DEV
const awsServiceProfileID = process.env.REACT_APP_AWS_SERVICE_PROFILE_ID_DEV

// eslint-disable-next-line import/prefer-default-export
export function registerLoraButton(deviceEUI, targetName) {
  const awsInterceptor = aws4Interceptor(
    {
      region: awsRegion,
      service: awsService,
    },
    {
      accessKeyId: awsAccessKeyID,
      secretAccessKey: awsSecretKey,
    },
  )
  const awsClient = axios.create()

  awsClient.interceptors.request.use(awsInterceptor)

  const url = 'https://api.iotwireless.us-east-1.amazonaws.com/wireless-devices'

  const data = {
    DestinationName: awsDeviceDestination,
    LoRaWAN: {
      DevEUI: deviceEUI,
      OtaaV1_0_x: {
        AppEui: awsAppEUI,
        AppKey: `${deviceEUI}${awsAppKeyPostfix}`,
      },
      ServiceProfileId: awsServiceProfileID,
      DeviceProfileId: awsDeviceProfileID,
    },
    Name: targetName,
    Type: awsDeviceType,
  }

  try {
    const response = awsClient.post(url, data)
    console.log(response)
  } catch (err) {
    console.error(err)
  }
}
