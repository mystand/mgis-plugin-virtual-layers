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

const OPERATIONS_SELECT_OPTIONS = [
  { value: '!=', label: '!=' },
  { value: '==', label: '==' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: 'present', label: 'Не пустое' }
]

export default {
  form: {
    fields: [
      {
        key: 'items',
        label: 'Виртуальные слои',
        input: 'array',
        item: {
          fields: [
            { key: 'sourceLayerKey', label: 'Исходный слой', input: 'select', inputOptions: { options: 'layers' } },
            { key: 'targetLayerKey', label: 'Слой назначения', input: 'select', inputOptions: { options: 'layers' } },
            { key: 'fields', label: 'Отображаемые поля', input: FieldsInput },
            {
              key: 'filters',
              label: 'Условия',
              input: 'array',
              item: {
                fields: [
                  { key: 'property', label: 'Поле', input: 'select', inputOptions: { options: buildFieldsOptions } },
                  {
                    key: 'operator',
                    label: 'Оператор',
                    input: 'select',
                    inputOptions: { options: OPERATIONS_SELECT_OPTIONS }
                  },
                  { key: 'value', label: 'Значение', input: 'string' }
                ]
              }
            },
            {
              key: 'exceptions',
              label: 'Исключения',
              input: 'array',
              item: {
                fields: [
                  { key: 'featureId', label: 'Id объекта', input: 'string' }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  saga,
  middleware,
  replaceReducers: [
    { replacer: buildLayersReducer, path: ['layers'] },
    { replacer: buildFeaturesReducer, path: ['features'] }
  ]
}
