// import shapeShifter from '@/components/shape-shifter/index.vue'
import emHeader from '@/components/em-header/index.vue'
import spots from '@/components/spots/index.vue'
import add from '@/components/add/index.vue'
import affix from '@/components/affix/index.vue'
import placeholder from '@/components/placeholder/index.vue'
export default (Vue: any) => {
  // Vue.component(shapeShifter.name, shapeShifter)
  Vue.component(emHeader.name, emHeader)
  Vue.component(spots.name, spots)
  Vue.component(add.name, add)
  Vue.component(affix.name, affix)
  Vue.component(placeholder.name, placeholder)
}
