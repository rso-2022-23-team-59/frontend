import { createApp } from "vue";
import App from "./App.vue";
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

let app = createApp(App);

app
  .use(store)
  .use(router)
  .use(vuetify)
  .use(VueAxios, axios)
  .use(VueApexCharts)
  .mount("#app");

// Make sure we can use dependency injection.
app.config.unwrapInjectedRef = true;