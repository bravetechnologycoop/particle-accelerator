import { Form, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * DropdownList
 *
 * React Component for displaying and selecting data from an external source (time-consuming fetches) by means of a dropdown
 *
 * @param {string} props.loading (state hook) the current state of loading the data from the external source
 * @param {string} props.item (state hook) the hook containing the currently selected value
 * @param {function} props.changeItem handler function to change the item
 * @param {[object]} props.itemList the data from the external source
 * @param {string} props.title placeholder text for the dropdown
 *
 * @requires props.itemList to be formatted as such: [{ name: _name, id: _id }]
 *
 * @return {JSX.Element}
 */
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
  if (loading === 'true') {
    return <Spinner animation="border" variant="primary" />
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
  loading: PropTypes.string.isRequired,
  item: PropTypes.string.isRequired,
  changeItem: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  itemList: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
}
