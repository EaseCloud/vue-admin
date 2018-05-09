import config from '../config'
import utils from '../utils'
import components from '../components'

export default {
  components,
  computed: {
    config: () => config,
    utils: () => utils
  }
}
