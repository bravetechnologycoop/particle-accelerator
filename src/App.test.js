import { render, screen } from '@testing-library/react'
import React from 'react'
import App from './App'

test('renders learn react link', () => {
  // eslint-disable-next-line react/jsx-filename-extension
  render(<App />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
