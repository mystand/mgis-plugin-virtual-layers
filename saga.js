import { takeEvery } from 'redux-saga'
import { put, select } from 'redux-saga/effects'

import * as featuresActions from 'core/frontend/features/features-actions'
import { isVirtualFeature, buildVirtualFeature } from './utils'

function* updateVirtualFeatures(action) {
  const config = yield select(state => state.pluginConfigs.virtualLayers)
  const feature = action.payload

  if (isVirtualFeature(feature)) return

  for (let index = 0; index < config.items.length; index += 1) {
    const item = config.items[index]
    if (item.sourceLayerKey === feature.properties.layer_key) {
      yield put(featuresActions.updateFeatureSuccess(buildVirtualFeature(feature, item, index)))
    }
  }
}

export default function* saga() {
  yield [
    takeEvery(featuresActions.UPDATE_FEATURE_SUCCESS, updateVirtualFeatures)
  ]
}
