import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'
import { ClickupStatuses } from '../../utilities/Constants'

function SearchBar(props) {
  const { searchValue, changeSearchValue, searchParam } = props
  if (searchParam === 'status') {
    return (
      <Form.Group>
        <Form.Control
          as="select"
          value={searchValue}
          onChange={x => {
            x.preventDefault()
            changeSearchValue(x.target.value)
          }}
        >
          {Object.values(ClickupStatuses).map(status => {
            return (
              <option id={status.name} value={status.name} key={status.name}>
                {status.displayName}
              </option>
            )
          })}
        </Form.Control>
      </Form.Group>
    )
  }
  return (
    <Form.Group>
      <Form.Control
        value={searchValue}
        onChange={x => {
          x.preventDefault()
          changeSearchValue(x.target.value)
        }}
      />
    </Form.Group>
  )
}

SearchBar.propTypes = {
  searchValue: PropTypes.string.isRequired,
  changeSearchValue: PropTypes.func.isRequired,
  searchParam: PropTypes.string.isRequired,
}

export default SearchBar
