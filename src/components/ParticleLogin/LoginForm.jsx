import Form from 'react-bootstrap/Form'
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import { getDisplayName, getProducts } from '../../utilities/ParticleFunctions'

const { login } = require('../../utilities/ParticleFunctions')

/**
 * LoginForm
 *
 * React Component which allows a user to log into their Particle account
 *
 * @param {function} props.changeToken handler function for changing the global Particle Token
 * @param {function} props.changeLoginState handler function for changing the global Particle login state
 * @param {function} props.changeParticleSettings handler function for changing the global Particle settings
 * @return {JSX.Element}
 * @constructor
 */
function LoginForm(props) {
  const { changeToken, changeLoginState, changeParticleSettings } = props

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')

  async function handleSubmit(evt) {
    changeLoginState('waiting')
    evt.preventDefault()
    const token = await login(email, password, otp)

    if (token !== null) {
      setEmail('')
      setPassword('')
      changeLoginState('true')
      changeToken(token)
      changeParticleSettings('userName', await getDisplayName(token))
      changeParticleSettings('productList', await getProducts(token))
      console.log(await getProducts(token))
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

      <Form.Group className="mb-3" controlId="formBaseicOtp">
        <Form.Label>One Time Password (2FA)</Form.Label>
        <Form.Control type="password" placeholder="OTP (2FA)" value={otp} onChange={x => setOtp(x.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}

LoginForm.propTypes = {
  changeToken: PropTypes.func.isRequired,
  changeLoginState: PropTypes.func.isRequired,
  changeParticleSettings: PropTypes.func.isRequired,
}

export default LoginForm
