import React, { PropTypes } from 'react'
import R from 'ramda'

import { getAttributesFromBuildOptions } from '../../utils'

const FieldsInput = (props) => {
  const { onChange, buildOptions } = props
  const value = props.value === '' ? [] : props.value
  const attributes = getAttributesFromBuildOptions(buildOptions)

  function onCheckboxChange(key) {
    onChange(R.toggle(key, value))
  }


  return (
    <div>
      <div>Отображаемые поля</div>
      <div style={ { marginLeft: '20px', marginBottom: '20px' } }>
        {
          R.toPairs(attributes).map(([key, attribute]) => {
            const id = `fields-${key}`
            return (
              <div key={ key }>
                <input
                  id={ id }
                  type='checkbox'
                  onChange={ R.partial(onCheckboxChange, [key]) }
                  checked={ R.contains(key, value) }
                />
                <label htmlFor={ id }> {attribute.label} </label>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

FieldsInput.propTypes = {
  buildOptions: PropTypes.shape({
    fieldPath: PropTypes.array.isRequired
  }).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired
}

export default FieldsInput
