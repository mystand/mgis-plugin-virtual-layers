import R from 'ramda'

import { DATA_FETCH_SUCCESS } from 'core/frontend/actions/data-actions'

export function buildLayersReducer(previousReducer) {
  return (state_, action) => {
    const state = previousReducer(state_, action)

    switch (action.type) {
    case DATA_FETCH_SUCCESS: {
      const config = R.find(x => x.key === 'virtualLayers', action.data.pluginConfigs)
      if (!config) return state

      const newState = { ...state }
      config.properties.items.forEach((item) => {
        const sourceLayer = state[item.sourceLayerKey]
        const targetLayer = state[item.targetLayerKey]
        if (R.isNil(sourceLayer) || R.isNil(targetLayer)) return // todo как нибудь валидировать

        const visibleFields = item.fields
        newState[targetLayer.key] = {
          ...targetLayer,
          geometry_type: sourceLayer.geometry_type,
          geometry_options: sourceLayer.geometry_options,
          attributes: {
            ...R.pick(visibleFields, sourceLayer.attributes),
            ...targetLayer.attributes
          },
          order: parseInt(targetLayer.order, 10) || sourceLayer.order + 1
        }
      })

      return newState
    }
    default:
      return state
    }
  }
}
