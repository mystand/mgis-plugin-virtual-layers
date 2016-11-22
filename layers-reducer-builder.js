import R from 'ramda'

import { DATA_FETCH_SUCCESS } from 'core/frontend/actions/data-actions'

export function buildLayersReducer(previousReducer) {
  return (state_, action) => {
    const state = previousReducer(state_, action)

    switch (action.type) {
    case DATA_FETCH_SUCCESS: {
      const config = R.find(x => x.key === 'virtualLayers', action.data.pluginConfigs)

      const newState = { ...state }
      config.properties.items.forEach((item, index) => {
        const sourceLayer = state[item.sourceLayerKey]
        const key = `vl-${index}-${sourceLayer.key}`
        newState[key] = {
          ...sourceLayer,
          key,
          name: item.name,
          order: parseInt(item.order, 10) || sourceLayer.order + 1
        }
      })

      return newState
    }
    default:
      return state
    }
  }
}
