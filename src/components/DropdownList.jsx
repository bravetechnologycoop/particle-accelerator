import { Form, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

export default function DropdownList(props) {
  const { loading, item, changeItem, itemList, title } = props
  if ((loading === 'idle' && itemList.length === 0) || loading === 'locked') {
    return (
      <Form.Control disabled as="select">
        <option id="" key="" value="">
          Select {title}
        </option>
      </Form.Control>
    )
  }
  if (itemList.length === 0) {
    return (
      <Form.Control disabled as="select">
        <option id="" key="" value="">
          Error
        </option>
      </Form.Control>
    )
  }
  if (loading === 'true') {
    return <Spinner animation="border" variant="primary" />
  }
  return (
    <Form.Control
      disabled={loading === 'true'}
      as="select"
      value={item}
      onChange={x => {
        changeItem(x.target.value)
      }}
    >
      <option id="" key="" value="">
        Select {title}
      </option>
      {itemList.map(itemInList => {
        return (
          <option key={itemInList.id} id={itemInList.id} value={itemInList.id}>
            {itemInList.name}
          </option>
        )
      })}
    </Form.Control>
  )
}

DropdownList.propTypes = {
  loading: PropTypes.string,
  item: PropTypes.string,
  changeItem: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  itemList: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
}

DropdownList.defaultProps = {
  loading: 'idle',
  item: '',
  changeItem: () => {},
  title: '',
}
