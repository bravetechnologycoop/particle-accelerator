import React from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function SensorEdit(props) {
  // eslint-disable-next-line no-unused-vars
  const { clickupToken, environment } = props

  const { clientId, sensorId } = useParams()

  const styles = {
    container: {
      padding: 10,
    },
  }

  return (
    <div style={styles.container}>
      <h1>
        {clientId}&apos;s {sensorId}
      </h1>
    </div>
  )
}

SensorEdit.propTypes = {
  clickupToken: PropTypes.string.isRequired,
  environment: PropTypes.string.isRequired,
}
