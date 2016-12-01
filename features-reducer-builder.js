import R from 'ramda'

import { DATA_FETCH_SUCCESS } from 'core/frontend/actions/data-actions'
import Feature from 'core/shared/models/feature'

import { buildVirtualFeature } from './utils'

function buildFilterMatch(filters, sourceLayer) {
  return R.pipe(
    R.prop('properties'),
    R.allPass(filters.map((filter) => {
      const definition = sourceLayer.attributes[filter.property]
      if (R.isNil(definition)) {
        console.error(`no property "${filter.property}" in layer: "${sourceLayer.key}"`)
        return () => false
      }
      const value = Feature.castPropertyType(definition, filter.value)

      if (filter.operator === 'present') return properties => R.isPresent(properties[filter.property])
      if (filter.operator === '==') return R.propEq(filter.property, value)
      if (filter.operator === '!=') return properties => !R.propEq(filter.property, value, properties)
      if (filter.operator === '>') return properties => properties[filter.property] > value
      if (filter.operator === '<') return properties => properties[filter.property] < value
      throw new Error('bad filter operator')
    }))
  )
}

export function buildFeaturesReducer(previousReducer) {
  return (state_, action) => {
    const state = previousReducer(state_, action)

    switch (action.type) {
    case DATA_FETCH_SUCCESS: {
      const config = R.find(x => x.key === 'virtualLayers', action.data.pluginConfigs)
      if (!config) return state
      const items = config.properties.items
      const features = R.values(state)

      const newState = { ...state }
      items.forEach((item, index) => {
        const { sourceLayerKey } = item
        const sourceLayer = R.find(layer => layer.key === sourceLayerKey, action.data.layers)
        if (R.isNil(sourceLayer)) return // todo как нибудь валидировать
        const isMatchedByFiltersFn = buildFilterMatch(item.filters, sourceLayer)
        const exceptionIds = R.isArrayLike(item.exceptions) ? item.exceptions.map(x => x.featureId) : null
        const isExceptionFn = feature => exceptionIds && exceptionIds.includes(feature.id)

        features
          .filter(feature => feature.properties.layer_key === sourceLayerKey)
          .filter(feature => isMatchedByFiltersFn(feature) || isExceptionFn(feature))
          .forEach((feature) => {
            const virtualFeature = buildVirtualFeature(feature, item, index)
            newState[virtualFeature.id] = virtualFeature
          })
      })

      return newState
    }
    default:
      return state
    }
  }
}
