import shapeShifter from '@/components/shape-shifter/index.vue'
import header from '@/components/header/index.vue'
import spots from '@/components/spots/index.vue'
import add from '@/components/add/index.vue'
export default (Vue: any) => {
  Vue.component(shapeShifter.name, shapeShifter)
  Vue.component(header.name, header)
  Vue.component(spots.name, spots)
  Vue.component(add.name, add)
}
