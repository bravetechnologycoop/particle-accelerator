import React from 'react'
import { Card } from 'react-bootstrap'

function HomeView() {
  const styles = {
    cardBoundary: {
      width: '100%',
      paddingTop: '10px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    cardInterior: {
      padding: '10px',
      flex: '1 1 950px',
      maxWidth: '55vw',
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
  }

  return (
    <div style={styles.centerParent}>
      <h1>Welcome to the PA.</h1>
      <h3>Usage Guide</h3>
      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Title style={styles.fontSize}>Authentication</Card.Title>
          <Card.Text>The PA has three main means of authentication.</Card.Text>
          <Card.Text>
            <b>Google</b>: Use your Brave Google account upon opening PA.
            <hr />
            Necessary for Use Of:
            <ul>
              <li>Everything!</li>
            </ul>
            <b>Particle</b>: Use Brave&apos;s Particle Login.
            <hr />
            Necessary for Use Of:
            <ul>
              <li>Activator</li>
              <li>Device Lookup</li>
              <li>Renamer</li>
            </ul>
            <b>ClickUp</b>: Login Using a Brave-Linked ClickUp Account via ClickUp
            <hr />
            Necessary for (Full) Use Of:
            <ul>
              <li>Button Registration</li>
              <li>Twilio Number Purchasing</li>
              <li>Activator</li>
              <li>Sensor Provisioning Guide</li>
              <li>Device Manager</li>
            </ul>
            <b>Additional Database Password</b>: Found in Brave 1Password
            <hr />
            Optional for Use Of:
            <ul>
              <li>Renamer</li>
            </ul>
          </Card.Text>
        </Card>
      </div>

      <h3 style={{ paddingTop: '10px', paddingBottom: '10px', textAlign: 'center' }}>Tools</h3>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Title style={styles.cardTitle}>Activator</Card.Title>
          <Card.Text>
            <b>Product</b>: Sensor
            <hr />
            <b>Authentication</b>: Particle, ClickUp (with list ID)
            <br />
            <br />
            <b>Requirements</b>:
            <ul>
              <li>
                Unactivated Boron serial number which has received <code>particle usb setup-done</code> command
              </li>
              <li>Production sensors Particle product family</li>
              <li>Country where the device will be located</li>
              <li>Clickup custom field configuration</li>
            </ul>
            <b>Effects</b>:
            <ul>
              <li>Adds device to Particle Product Family</li>
              <li>Enables device to receive Brave firmware OTA</li>
              <li>Creates a new task in the PA Tracker in ClickUp</li>
            </ul>
            <hr />
            The Activator tool is for use in the provisioning process of sensors. Its intent is to be used when a Boron device is taken out of the
            box, and is ready to be provisioned. After using the Activator, the Boron can be left connected to power (no computer required) until the
            device connects to the Particle servers and receives the latest firmware. The LED on the Boron should breath cyan in this state.
            <br />
            <br />
            Before using the Activator on a Boron, it is important that the <code>particle usb setup-done</code> command is sent by USB serial and the
            Particle CLI.
            <br />
            <br />
            The Activator can also create a task in Brave&apos;s ClickUp Sensor Tracker, by selecting the correct custom fields. Keep in mind that one
            must be logged in to ClickUp in order to access the Sensor Tracker.
          </Card.Text>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Title style={styles.cardTitle}>Device Lookup</Card.Title>
          <Card.Text>
            <b>Product</b>: Sensor
            <br />
            <b>Authentication</b>: Particle
            <br />
            <br />
            <b>Requirements</b>:
            <ul>
              <li>Serial Number of a Boron device</li>
              <li>Particle product family to search for the device in</li>
            </ul>
            <b>Effects</b>: None
            <hr />
            Device Lookup allows a user to scan the barcode on a Boron in order to determine its name and other details without having to touch the
            Particle console.
          </Card.Text>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Title style={styles.cardTitle}>Device Manager</Card.Title>
          <Card.Text>
            <b>Product</b>: Sensor
            <br />
            <b>Authentication</b>: Particle and Clickup
            <br />
            <b>Requirements</b>:
            <ul>
              <li>Clickup auth</li>
            </ul>
            The Device Manager allows the user to interface with the tasks in the PA tracker in order to share and add devices across different
            browsers/users.
          </Card.Text>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Title style={styles.cardTitle}>Particle Client Functions</Card.Title>
          <Card.Text>
            <b>Product</b>: Sensor
            <br />
            <b>Authentication</b>: Particle
            <br />
            <b>Requirements</b>:
            <ul>
              <li>Particle auth</li>
              <li>Clients display name in the sensors database</li>
            </ul>
            <hr />
            The Particle Client Functions tool allows users to call a Particle function for all devices associated with a given client. This is done
            by retrieving the devices from the database and invoking functions using the Particle JS SDK.
          </Card.Text>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Title style={styles.cardTitle}>Renamer</Card.Title>
          <Card.Text>
            <b>Product</b>: Sensor
            <br />
            <b>Authentication</b>: Particle (optional), ClickUp (optional), Dashboard Password (optional)
            <br />
            <br />
            <b>Requirements</b>:
            <ul>
              <li>
                An activated Boron, added through the Activator or <del>Device Adder</del>
              </li>
              <li>A valid locationID for the device to be renamed to</li>
            </ul>
            <b>Optionals</b>:
            <ul>
              <li>Twilio Number Area Code</li>
              <li>Dashboard Display Name</li>
              <li>Dashboard Radar Type</li>
              <li>Dashboard Client</li>
              <li>Dashboard Password</li>
            </ul>
            <b>Effects (All only if selected)</b>:
            <ul>
              <li>Renames device on Particle</li>
              <li>Renames task on Sensor Tracker</li>
              <li>Purchases a Twilio phone number and registers it to the Sensor Production account with all necessary webhooks</li>
              <li>Adds the Twilio number to the task on the Sensor Tracker</li>
              <li>Inserts a new Location into the Sensors database</li>
              <li>Creates a label for the sensor</li>
            </ul>
            <hr />
            The Renamer Tool is intended for the part of the sensor provisioning process when a sensor is assigned to a client. It can change/add four
            different things:
            <ul>
              <li>
                Change: <u>Device Name</u> on Particle
              </li>
              <li>
                Change: <u>Task Name</u> on Clickup
              </li>
              <li>
                Create: <u>Twilio Number</u> for device
              </li>
              <li>
                Add: Device to <u>Sensor Dashboard</u>
              </li>
            </ul>
            It also produces labels for sensors for the Polono PL60 printer (2.4in x 1.2in).
          </Card.Text>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Title style={styles.cardTitle}>Button Registration</Card.Title>
          <Card.Text>
            <b>Product</b>: Buttons
            <br />
            <br />
            <b>Requirements</b>:
            <ul>
              <li>An EUI of a not-already-registered RAK LoRa Button</li>
              <li>A valid name for the device to go on AWS</li>
            </ul>
            <b>Effects</b>:
            <ul>
              <li>
                Creates a <i>thing</i> in the desired AWS account
              </li>
              <li>Registers the RAK button as a device under the AWS account</li>
              <li>
                Registers the RAK button to the <i>thing</i>
              </li>
            </ul>
            <hr />
            The Button Registration tool provides easy registration of RAK LoRa buttons to Brave&apos;s AWS account. It takes the EUI and a name for
            the device and interfaces with AWS&apos;s apis to register the device.
          </Card.Text>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Title style={styles.cardTitle}>Twilio Number Purchasing</Card.Title>
          <Card.Text>
            <b>Product</b>: Buttons and Sensor
            <br />
            <br />
            <b>Requirements</b>:
            <ul>
              <li>The Brave product family to purchase a Twilio number for</li>
              <li>A valid name to set as the Twilio Number&apos;s friendly name as</li>
              <li>Area code to for the new Twilio number</li>
            </ul>
            <b>Effects</b>:
            <ul>
              <li>Purchases a new Twilio phone number in either the Sensor or Buttons prod account</li>
              <li>Configures the necessary webhooks and messaging services for the new phone number</li>
              <li>Returns the phone number to the user for use in other applications</li>
            </ul>
            <hr />
            The Twilio Number Purchasing tool is meant for rapid acquiring of a Twilio phone number for either Sensor or Buttons production devices.
            It takes the most basic inputs from the user and returns a phone number.
          </Card.Text>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Title style={styles.cardTitle}>Message Clients</Card.Title>
          <Card.Text>
            <b>Product</b>: Buttons and Sensor
            <br />
            <br />
            <b>Requirements</b>:
            <ul>
              <li>A message for active Buttons or Sensor clients</li>
            </ul>
            <b>Effects</b>:
            <ul>
              <li>Sends the submitted message to active Buttons or Sensor clients using Twilio</li>
            </ul>
            <hr />
            The Message Clients tool is meant for deployments or notifications of downtime. Use this tool sparingly, as most clients expect text
            messages to be alerts.
          </Card.Text>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Title style={styles.cardTitle}>System Status</Card.Title>
          <Card.Text>
            <b>Product</b>: Buttons and Sensor
            <hr />
            The System Status tool summarizes the health of our Brave Devices. Depending on the environment selected in the nav bar, this tool checks
            the server connection and database connnection for BraveButtons and BraveSensor.
          </Card.Text>
        </Card>
      </div>

      <div style={styles.cardBoundary}>
        <Card style={styles.cardInterior}>
          <Card.Title style={styles.cardTitle}>Safe Mode</Card.Title>
          <Card.Text>Safe stops a user from registering the same device twice.</Card.Text>
        </Card>
      </div>
    </div>
  )
}

export default HomeView
