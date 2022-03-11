import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import propTypes from 'prop-types'
import { getProducts } from '../utilities/ParticleFunctions'

function ProductDropdown(props) {
  const { productID, changeProductID, formLock, token } = props
  const [productList, setProductList] = useState([])
  const [loadStatus, setLoadStatus] = useState(false)

  useEffect(() => {
    async function fetchUserInfo() {
      const response = await getProducts(token)
      setProductList(response)
    }
    setLoadStatus(false)
    fetchUserInfo()
    setLoadStatus(true)
  }, [token])

  if (loadStatus) {
    return (
      <Form.Group className="mb-3" controlId="formProductSelect">
        <Form.Label>Select Device Product Family</Form.Label>
        <Form.Control
          disabled={formLock}
          as="select"
          value={productID}
          onChange={x => {
            changeProductID(x.target.value)
          }}
        >
          <option id="null" key="null" value="null">
            No Product Family
          </option>
          {productList.map(product => {
            return (
              <option key={`${product.id}`} id={`${product.id}`} value={`${product.id}`}>
                {`${product.id}`.concat(': ', product.name, ' (', product.deviceType, ')')}
              </option>
            )
          })}
        </Form.Control>
      </Form.Group>
    )
  }
  return <Spinner animation="border" />
}

ProductDropdown.propTypes = {
  productID: propTypes.string,
  changeProductID: propTypes.func,
  formLock: propTypes.bool,
  token: propTypes.string,
}

ProductDropdown.defaultProps = {
  productID: '',
  changeProductID: () => {},
  formLock: false,
  token: '',
}

export default ProductDropdown
