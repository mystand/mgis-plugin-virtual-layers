import * as featuresActions from 'core/frontend/features/features-actions'

import { isVirtualFeature } from './utils'

const { UPDATE_FEATURE_REQUEST } = featuresActions

function isVirtualFeatureUpdate(action) {
  return action.type === UPDATE_FEATURE_REQUEST && isVirtualFeature(action.payload)
}

const middleware = store => next => (action) => {
  if (isVirtualFeatureUpdate(action)) {
    console.info('action canceled', action)

    const feature = action.payload
    const realId = feature.id.match(/^vl-\d-(.*)$/)[1]
    const realFeature = store.getState().features[realId]

    store.dispatch(featuresActions.updateFeature({
      ...realFeature,
      properties: {
        ...realFeature.properties,
        ...feature.properties,
        layer_key: realFeature.properties.layer_key
      },
      geometry: feature.geometry
    }))
  } else {
    next(action)
  }
}

export default middleware
