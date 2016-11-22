import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Layer from 'core/frontend/client/layers-panel/Layer'
import * as virtualLayerActions from 'core/frontend/client/map/map-actions'

export default connect(
  (state, props) => {
    const item = props.item
    const sourceLayer = state.layers[item.sourceLayerKey]

    return {
      layer: {
        ...sourceLayer,
        name: item.name,
        __item: item
      }
    }
  },
  () => ({
    onClick: () => {
    }
  })
)(Layer)
