import _ from 'lodash'
import defaultConfig from './default'
import config from '../../demo/config'

config.hooks = _.merge({}, defaultConfig.hooks, config.hooks)

export default Object.assign(defaultConfig, config)
