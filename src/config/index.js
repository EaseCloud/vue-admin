import defaultConfig from './default'
import config from '../../demo/config'

Object.assign(config.hooks, defaultConfig.hooks)

export default Object.assign(defaultConfig, config)
