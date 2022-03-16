import React from 'react'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'

function RenamerView() {
  async function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <>
      <h1>Renamer View</h1>
      <h3>Text</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Select Product</Form.Label>
          <Form.Control />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </>
  )
}

export default RenamerView
