import Form from 'react-bootstrap/Form'
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import { getDisplayName } from '../utilities/ParticleFunctions'

const { login } = require('../utilities/ParticleFunctions')

/**
 * LoginForm:
 * A React component which allows a user to log into an account using their
 * username and email and acquires a token if the login is successful.
 * @modifies the global token variable and the global loginState variable.
 */
function LoginForm(props) {
  const { changeToken, changeLoginState, changeParticleSettings } = props

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(evt) {
    changeLoginState('waiting')
    evt.preventDefault()
    const token = await login(email, password)

    if (token !== null) {
      setEmail('')
      setPassword('')
      changeLoginState('true')
      changeToken(token)
      changeParticleSettings('userName', await getDisplayName(token))
    } else {
      changeToken('passwordincorrect')
      changeLoginState('passwordincorrect')
    }
  }

  return (
    // eslint-disable-next-line react/jsx-no-bind
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={x => setEmail(x.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={x => setPassword(x.target.value)} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}

LoginForm.propTypes = {
  changeToken: PropTypes.func,
  changeLoginState: PropTypes.func,
  changeParticleSettings: PropTypes.func,
}

LoginForm.defaultProps = {
  changeToken: () => {},
  changeLoginState: () => {},
  changeParticleSettings: () => {},
}

export default LoginForm
