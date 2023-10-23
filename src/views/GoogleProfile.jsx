import React from 'react'
import PropTypes from 'prop-types'

function GoogleProfile(props) {
  const { googleProfile } = props

  return (
    <div style={{ width: '25ch', padding: 20 }}>
      <h2>Google Profile</h2>
      <img style={{ width: 32 }} src={googleProfile.picture} alt="" />
      <p>Name: {googleProfile.name}</p>
      <p>Email: {googleProfile.email}</p>
    </div>
  )
}

GoogleProfile.propTypes = { googleProfile: PropTypes.shape.isRequired }

export default GoogleProfile
