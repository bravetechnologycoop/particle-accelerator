import React from 'react'
import { Card } from 'react-bootstrap'
import Step1 from '../graphics/sensor-provisioning-guide/Step1.svg'
import Step2 from '../graphics/sensor-provisioning-guide/Step2.svg'
import Step3 from '../graphics/sensor-provisioning-guide/Step3.svg'
import Step4 from '../graphics/sensor-provisioning-guide/Step4.svg'
import Step5 from '../graphics/sensor-provisioning-guide/Step5.svg'
import Step6 from '../graphics/sensor-provisioning-guide/Step6.svg'
import Step7 from '../graphics/sensor-provisioning-guide/Step7.svg'
import Step8 from '../graphics/sensor-provisioning-guide/Step8.svg'
import Step9 from '../graphics/sensor-provisioning-guide/Step9.svg'
import Step10 from '../graphics/sensor-provisioning-guide/Step10.svg'
import Step10_2 from '../graphics/sensor-provisioning-guide/Step10-2.svg'
import Step11 from '../graphics/sensor-provisioning-guide/Step11.svg'
import '../stylesheets/SensorProvisioningGuide.css'

function SensorProvisioningGuide() {
  const styles = {
    cardBoundary: {
      flex: '1 1',
      paddingTop: '10px',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    cardInterior: {
      padding: '10px',
      flex: '1 1',
      maxWidth: '900px',
    },
    centerParent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
      padding: 20,
    },
    cardTitle: {
      fontSize: '28px',
    },
    cardBodyParent: {
      display: 'flex',
      flexDirection: 'row',
    },
    stepText: {
      flex: '2 2',
    },
    stepGraphic: {
      flex: '4 4',
      paddingLeft: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    stepTitle: {
      fontSize: 'large',
      fontWeight: '600',
    },
  }

  return (
    <div style={styles.centerParent}>
      <h1>Sensor Provisioning Guide</h1>
      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="1">
                <li style={styles.stepTitle}>
                  Log into the Brave <a href="/particle">Particle</a> account and your <a href="/clickup">ClickUp</a> account in the PA.
                </li>
              </ol>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step1} alt="Step 1" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="2">
                <li style={styles.stepTitle}>
                  Select the environment (Development, Staging, or Production) for which the Devices will be provisioned from the bottom left of the
                  menu bar.
                </li>
              </ol>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step2} alt="Step 2" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="3">
                <li style={styles.stepTitle}>
                  Use the <a href="/activator">Activator</a> to register the Boron to Brave&apos;s <u>Production Sensor</u> Particle product family.
                </li>
              </ol>
              <ul>
                <li>
                  Use the <code>sensor_number</code> nomenclature for new sensors
                </li>
                <li>
                  Check the{' '}
                  <a
                    href={`https://console.particle.io/${process.env.REACT_APP_PARTICLE_SENSOR_PRODUCT_URL}/devices`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Particle Console
                  </a>
                  ,{' '}
                  <a
                    href={`https://app.clickup.com/${process.env.REACT_APP_CLICKUP_BRAVE_TEAM_ID}/v/l/li/${process.env.REACT_APP_CLICKUP_PA_TRACKER_LIST_ID_PROD}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    PA Tracker
                  </a>
                  , or{' '}
                  <a href={process.env.REACT_APP_SENSOR_TRACKER_LINK} target="_blank" rel="noreferrer">
                    Sensor Tracker
                  </a>{' '}
                  to see what the highest <code>number</code> currently is.
                </li>
                <li>
                  Scan the QR code on the Boron. The first string is the <code>Device Serial Number</code>.
                </li>
              </ul>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step3} alt="Step 3" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="4">
                <li style={styles.stepTitle}>
                  Connect the Boron to power and wait for the <u>Breathing Cyan</u> light.
                </li>
              </ol>
              <ul>
                <li>Attach the antenna to the boron.</li>
                <li>Use a micro-USB cable to connect it to a power source.</li>
                <li>Green light means that it is connecting to the internet.</li>
                <li>Purple light means that it is flashing the firmware.</li>
                <li>Blinking cyan light means that it is connecting to the cloud.</li>
                <li>Wait for a breathing cyan light and ensure that it has been breathing for at least a minute.</li>
                <li>This step might take a considerable amount of time. The boron must be connected to power for the next steps.</li>
              </ul>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step4} alt="Step 4" width="650px" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="5">
                <li style={styles.stepTitle}>Obtain an IM24 Door Sensor and retrieve it&apos;s BLE ID (shown in image) to pair it to the Boron.</li>
              </ol>
              <ul>
                <li>The BLE ID can be found at the side of the bigger block of the IM24 sensor.</li>
                <li>Take note of the last 6 digits of the ID.</li>
              </ul>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step5} alt="Step 5" width="500px" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="6">
                <li style={styles.stepTitle}>Open the Particle Console to the device and pair the Boron with the IM24 Door Sensor.</li>
              </ol>
              <ul>
                <li>In the top right, change Sandbox to Brave Technology Coop.</li>
                <li>Click on Production Sensor Devices.</li>
                <li>Click on Devices (cube on left bar) and search for the newly connected device by name.</li>
                <li>
                  Under functions, input in <code>Change_IM24_Door_ID</code> the last 6 digits of the IM24 ID with commas after every 2 digits.
                </li>
              </ul>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step6} alt="Step 6" width="90%" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="7">
                <li style={styles.stepTitle}>
                  Pass <code>1</code> to <code>Turn_Debugging_Publishes_On_Off</code> to start the event stream.
                </li>
              </ol>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step7} alt="Step 7" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="8">
                <li style={styles.stepTitle}>
                  Test the Door Sensor. To declare the device successfully tested, wait until the following debugging values are achieved.
                </li>
              </ol>
              <div style={{ paddingLeft: '2em' }}>
                <code>door_status</code> (first status) = <code>0x99</code>
                <ul>
                  <li>Upon connection, this should be the status.</li>
                </ul>
                <code>door_status</code> (closed door, tamper in) = <code>0x00</code>
                <ul>
                  <li>Join the Door Sensor Blocks and hold down the tamper at the back.</li>
                </ul>
                <code>door_status</code> (closed door, tamper out) = <code>0x01</code>
                <ul>
                  <li>Join the Door Sensor Blocks and do not hold down the tamper at the back.</li>
                </ul>
                <code>door_status</code> (open door, tamper in) = <code>0x02</code>
                <ul>
                  <li>Separate the Door Sensor Blocks and hold down the tamper at the back.</li>
                </ul>
                <code>door_status</code> (open door, tamper out) = <code>0x03</code>
                <ul>
                  <li>Seperate the Door Sensor Blocks and do not hold down the tamper at the back.</li>
                </ul>
              </div>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step8} alt="Step 8" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="9">
                <li style={styles.stepTitle}>
                  Pass <code>0</code> to <code>Turn_Debugging_Publishes_On_Off</code> to stop the event stream.
                </li>
              </ol>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step9} alt="Step 9" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="10">
                <li style={styles.stepTitle}>
                  With the Boron, PCB, and Antenna inside an enclosure with a Paired Door Sensor, select the current device in the{' '}
                  <a href="/renamer">Renamer</a>
                  <hr />
                  Enter a unique <code>locationID</code> for the device and follow the prompts for all of the other configurations.
                </li>
              </ol>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step10} alt="Step 10" />
              <img src={Step10_2} alt="Step 10" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="11">
                <li style={styles.stepTitle}>
                  Connect the{' '}
                  <a href="https://support.munbyn.com/hc/en-us/articles/6092544741651-Printer-User-Manuals" target="_blank" rel="noreferrer">
                    MUNBYN 941 USB Label Printer
                  </a>{' '}
                  to your computer and print the labels provided by the Renamer.
                </li>
              </ol>
              <div style={{ paddingLeft: '2em' }}>
                Print the three generated labels:
                <ul>
                  <li>One Brave Sensor Label to go on the external packaging (save for later)</li>
                  <li>One Main Sensor Label a public-facing side of the boron enclosure</li>
                  <li>One Door Sensor Label to go on the door sensor box</li>
                </ul>
              </div>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step11} alt="Step 11" />
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default SensorProvisioningGuide
