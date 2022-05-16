import React from 'react'
import { Card } from 'react-bootstrap'
import Step1 from '../graphics/sensor-provisioning-guide/step1.svg'
import Step2 from '../graphics/sensor-provisioning-guide/Step2.svg'
import Step3 from '../graphics/sensor-provisioning-guide/Step3.svg'
import Step4 from '../graphics/sensor-provisioning-guide/Step4.svg'
import Step5 from '../graphics/sensor-provisioning-guide/Step5.svg'
import Step6 from '../graphics/sensor-provisioning-guide/Step6.svg'
import Step7 from '../graphics/sensor-provisioning-guide/Step7.svg'
import Step8 from '../graphics/sensor-provisioning-guide/Step8.svg'
import Step9 from '../graphics/sensor-provisioning-guide/Step9.svg'
import Step11 from '../graphics/sensor-provisioning-guide/Step11.svg'
import Step11_2 from '../graphics/sensor-provisioning-guide/Step11-2.svg'
import Step12 from '../graphics/sensor-provisioning-guide/Step12.svg'
import '../stylesheets/SensorProvisioningGuide.css'
import { ClickupStatuses } from '../utilities/Constants'

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
              <ol>
                <li style={styles.stepTitle}>
                  Write the command <code>particle setup usb-done</code> to a new Particle Boron device.
                </li>
              </ol>
              <ul>
                <li>
                  You must have the{' '}
                  <a href="https://docs.particle.io/tutorials/developer-tools/cli/" target="_blank" rel="noreferrer">
                    Particle CLI
                  </a>{' '}
                  installed to do this.
                </li>
              </ul>
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
                  Log into the Brave <a href="/particle">Particle</a> account and your <a href="/clickup">ClickUp</a> account in the PA.
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
                <li>Use the big blue USB charger.</li>
                <li>This may take a considerable amount of time.</li>
                <li>Ensure that the cyan light has been breathing for at least a minute.</li>
              </ul>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step4} alt="Step 4" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="5">
                <li style={styles.stepTitle}>
                  Obtain an IM21 Door Sensor and retrieve it&apos;s BLE ID (shown in image) and use the{' '}
                  <a href="/door-sensor-pairing">Door Sensor Pairing Tool</a> to pair the IM21 to the Boron.
                </li>
              </ol>
              <ul>
                <li>The BLE ID can be found between the two blocks of the IM21 sensor.</li>
                <li>The Boron must be connected to power and internet.</li>
              </ul>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step5} alt="Step 5" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="6">
                <li style={styles.stepTitle}>Wait for the Device to finish pairing.</li>
              </ol>
              <ul>
                <li>The Boron must be connected to power and internet.</li>
              </ul>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step6} alt="Step 6" width="300px" />
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
                  Connect the Particle to a Brave Sensor PCB and open the{' '}
                  <a
                    href={`https://console.particle.io/${process.env.REACT_APP_PARTICLE_SENSOR_PRODUCT_URL}/devices`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Particle Console
                  </a>{' '}
                  to the device. <br />
                  <br /> Enter <code>1</code> in the <code>Turn_Debugging_Publishes_On_Off</code> function.
                </li>
              </ol>
              <ul>
                <li>It is considered best practice to have the PCB mounted in the enclosure at this point.</li>
                <li>Ensure that the PCB has been tested using the ESP32 testing tool.</li>
                <li>The Boron must be connected to power and internet.</li>
              </ul>
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
                <li style={styles.stepTitle}>To declare the device successfully tested, wait until the following debugging values are achieved.</li>
              </ol>
              <div style={{ paddingLeft: '2em' }}>
                <code>INS_val</code> (high movement) &gt; <code>2500</code>
                <ul>
                  <li>Shake the Door Sensor Around and Create Movement</li>
                </ul>
                <code>INS_val</code> (low movement) &lt; <code>60</code>
                <ul>
                  <li>Leave the Door Sensor to Rest on a Table</li>
                </ul>
                <code>door_status</code> (open door) = <code>0x02</code>
                <ul>
                  <li>Separate the Door Sensor Blocks</li>
                </ul>
                <code>door_status</code> (closed door) = <code>0x00</code>
                <ul>
                  <li>Join the Door Sensor Blocks</li>
                </ul>
                Other Door Sensor Codes:
                <ul>
                  <li>
                    <code>0x04</code>: Closed and Low Battery
                  </li>
                  <li>
                    <code>0x08</code>: Closed and Heartbeat
                  </li>
                  <li>
                    <code>0x0C</code>: Closed, Heartbeat, and Low Battery
                  </li>
                  <li>
                    <code>0x06</code>: Open and Low Battery
                  </li>
                  <li>
                    <code>0x0A</code>: Open and Heartbeat
                  </li>
                  <li>
                    <code>0x0E</code>: Open, Heartbeat, and Low Battery
                  </li>
                </ul>
              </div>
              <br />
              <ul>
                <li>The Boron must be connected to power and internet.</li>
              </ul>
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
              <ul>
                <li>The Boron must be connected to power and internet.</li>
              </ul>
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
                  Change the ClickUp status of the device from{' '}
                  <mark style={{ background: ClickupStatuses.pairedDoorSensor.color }}>Paired Door Sensor</mark>
                  to <mark style={{ background: ClickupStatuses.tested.colour }}>Tested</mark>
                  in the{' '}
                  <a
                    href={`https://app.clickup.com/${process.env.REACT_APP_CLICKUP_BRAVE_TEAM_ID}/v/l/li/${process.env.REACT_APP_CLICKUP_PA_TRACKER_LIST_ID_PROD}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    PA Tracker.
                  </a>
                </li>
              </ol>
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
                  With the Boron, PCB, and Antenna inside an enclosure with a Paired Door Sensor, select the current device in the{' '}
                  <a href="/renamer">Renamer</a>
                  <hr />
                  Enter a unique <code>locationID</code> for the device and follow the prompts for all of the other configurations.
                </li>
              </ol>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step11} alt="Step 11" />
              <img src={Step11_2} alt="Step 11" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Body style={styles.cardBodyParent}>
            <div style={styles.stepText}>
              <ol start="12">
                <li style={styles.stepTitle}>
                  Connect the{' '}
                  <a href="https://www.polono.com/pages/driver-user-manual" target="_blank" rel="noreferrer">
                    Polono PL60 Label Printer
                  </a>{' '}
                  to your computer and print the labels provided by the Renamer.
                </li>
              </ol>
              <div style={{ paddingLeft: '2em' }}>
                Print 4 labels in total:
                <br />
                <br />3 Main Sensor Labels:
                <ul>
                  <li>One to cover the redundant Mirco USB hole</li>
                  <li>One on another face of the sensor (ensure there is one public-facing label)</li>
                  <li>One to go on the external packaging (save for later)</li>
                </ul>
                1 Door Sensor Label to go on the IM21 box.
              </div>
            </div>
            <div style={styles.stepGraphic}>
              <img src={Step12} alt="Step 12" />
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default SensorProvisioningGuide
