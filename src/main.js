import { createApp } from "vue";
import App from "./App.vue";
import mitt from 'mitt';
import router from "./router";
import store from "./store";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import axios from "axios";
import VueAxios from "vue-axios";
import VueApexCharts from "vue3-apexcharts";

const vuetify = createVuetify({
  components,
  directives,
});

// Event bus
const emitter = mitt();

let app = createApp(App);
app.config.globalProperties.emitter = emitter;

app
  .use(store)
  .use(router)
  .use(vuetify)
  .use(VueAxios, axios)
  .use(VueApexCharts)
  .mount("#app");

// Make sure we can use dependency injection.
app.config.unwrapInjectedRef = true;