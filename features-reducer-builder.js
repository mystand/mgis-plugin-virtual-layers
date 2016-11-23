import R from 'ramda'

import { DATA_FETCH_SUCCESS } from 'core/frontend/actions/data-actions'
import Feature from 'core/shared/models/feature'

import { buildVirtualFeature } from './utils'

function buildCheckFilter(filters, sourceLayer) {
  return R.pipe(
    R.prop('properties'),
    R.allPass(filters.map((filter) => {
      const value = Feature.castPropertyType(sourceLayer.attributes[filter.property], filter.value)

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
        const sourceLayerKey = item.sourceLayerKey
        const sourceLayer = R.find(layer => layer.key === sourceLayerKey, action.data.layers)
        const checkFilter = buildCheckFilter(item.filters, sourceLayer)

        features
          .filter(feature => feature.properties.layer_key === sourceLayerKey)
          .filter(checkFilter)
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
