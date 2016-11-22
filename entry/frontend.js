import R from 'ramda'

import saga from '../saga'
import middleware from '../middleware'
import { buildLayersReducer } from '../layers-reducer-builder'
import { buildFeaturesReducer } from '../features-reducer-builder'

function buildFieldsOptions(options) {
  const { values, fieldPath, directories: { layers } } = options
  const sourceLayerKeyFieldPath = [fieldPath[0], fieldPath[1], 'sourceLayerKey']
  const sourceLayerKeyValue = R.path(sourceLayerKeyFieldPath, values)

  if (R.isNil(sourceLayerKeyValue)) return []

  const attributes = R.find(x => x.key === sourceLayerKeyValue, layers).attributes
  return R.keys(attributes).map(key => ({ value: key, label: attributes[key].label }))
}

const OPERATIONS = ['!=', '==', '>', '<']
const OPERATIONS_SELECT_OPTIONS = OPERATIONS.map(value => ({ value, label: value }))

export default {
  name: 'Virtual Layers',
  options: [
    {
      key: 'items',
      label: 'Виртуальные слои',
      type: 'array',
      item: {
        fields: [
          { key: 'name', label: 'Название', type: 'string' },
          { key: 'order', label: 'Порядок', type: 'string' },
          { key: 'sourceLayerKey', label: 'Первичный слой', type: 'select', options: 'layers' },
          {
            key: 'filters',
            label: 'Условия',
            type: 'array',
            item: {
              fields: [
                { key: 'property', label: 'Поле', type: 'select', options: buildFieldsOptions },
                { key: 'operator', label: 'Оператор', type: 'select', options: OPERATIONS_SELECT_OPTIONS },
                { key: 'value', label: 'Значение', type: 'string' }
              ]
            }
          }
        ]
      }
    }
  ],
  connects: {
    saga,
    middleware,
    replaceReducers: [
      { replacer: buildLayersReducer, path: ['layers'] },
      { replacer: buildFeaturesReducer, path: ['features'] }
    ]
  }
}
