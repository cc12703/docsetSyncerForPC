
import * as store from '@/render/store'


declare module "vue/types/vue" {

  interface Vue {
    $store: typeof store
  }

}