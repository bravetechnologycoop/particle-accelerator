// Third-party dependencies
import React from 'react'
import { Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default function SpinnerWithTimeEstimate(props) {
  const { timeEstimate, timeEstimateUnits } = props

  const styles = {
    fixedWidth: {
      width: 45,
    },
  }

  return (
    <div>
      <div className="mx-auto" style={styles.fixedWidth}>
        <Spinner animation="border" />
      </div>
      <p className="text-center">
        It is normal for this to take up to {timeEstimate} {timeEstimateUnits}.
      </p>
    </div>
  )
}

SpinnerWithTimeEstimate.propTypes = {
  timeEstimate: PropTypes.number.isRequired,
  timeEstimateUnits: PropTypes.string.isRequired,
}
