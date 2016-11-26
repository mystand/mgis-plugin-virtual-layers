import R from 'ramda'

import saga from '../saga'
import middleware from '../middleware'
import { buildLayersReducer } from '../layers-reducer-builder'
import { buildFeaturesReducer } from '../features-reducer-builder'
import FieldsInput from '../components/fields-input/FieldsInput'
import { getAttributesFromBuildOptions } from '../utils'

function buildFieldsOptions(options) {
  const attributes = getAttributesFromBuildOptions(options)
  return R.keys(attributes).map(key => ({ value: key, label: attributes[key].label }))
}

// function buildExceptiFeatures

const OPERATIONS_SELECT_OPTIONS = [
  { value: '!=', label: '!=' },
  { value: '==', label: '==' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: 'present', label: 'Не пустое' }
]

export default {
  name: 'Virtual Layers',
  options: [
    {
      key: 'items',
      label: 'Виртуальные слои',
      type: 'array',
      item: {
        fields: [
          { key: 'sourceLayerKey', label: 'Исходный слой', type: 'select', options: 'layers' },
          { key: 'targetLayerKey', label: 'Слой назначения', type: 'select', options: 'layers' },
          { key: 'fields', label: 'Отображаемые поля', type: FieldsInput },
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
          },
          {
            key: 'exceptions',
            label: 'Исключения',
            type: 'array',
            item: {
              fields: [
                { key: 'featureId', label: 'Id объекта', type: 'string' }
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
