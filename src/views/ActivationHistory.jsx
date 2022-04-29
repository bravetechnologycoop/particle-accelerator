import PropTypes from 'prop-types'
import React from 'react'
import ActivationAttempt from '../utilities/ActivationAttempt'
import ActivationRow from '../components/ActivationHistory/ActivationRow'

function ActivationHistory(props) {
  const { activationHistory } = props

  if (activationHistory.length === 0) {
    return (
      <>
        <h1>Activation History</h1>
        <hr />
        <h3>No Activation History</h3>
      </>
    )
  }

  return (
    <>
      <h1>Activation History</h1>
      <hr />
      <div style={{ overflow: 'auto' }}>
        {activationHistory.map(attempt => {
          return (
            <li key={`${attempt.timeStamp}${attempt.dateStamp}`} style={{ listStyle: 'none', paddingTop: '0.3em', paddingBottom: '0.3em' }}>
              <ActivationRow attempt={attempt} />
            </li>
          )
        })}
      </div>
    </>
  )
}

ActivationHistory.propTypes = {
  activationHistory: PropTypes.arrayOf(PropTypes.instanceOf(ActivationAttempt)).isRequired,
}

export default ActivationHistory
