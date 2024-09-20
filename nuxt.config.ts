// https://nuxt.com/docs/api/configuration/nuxt-config

import { sys } from "typescript";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@vuestic/nuxt", "@pinia/nuxt", "@nuxtjs/i18n"],
  typescript: {
    typeCheck: true,
    strict: false,
  },
  i18n: {
    lazy: true,
    langDir: "lang",
    defaultLocale: "es",
    strategy: "prefix_except_default",
    locales: [
      { code: "es", files: [{ path: "es-ES.json", cache: false }] },
      // { code: "gb", file: "gb.json" },
    ],
  },
  vuestic: {
    config: {
      // Config here
    },

    css: ["typography", "reset"],
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      apiAuthBaseUrl: process.env.IDENTITI_API_BASE_URL,
      generalParam: process.env.GENERAL_PARAM,
      especificParam: process.env.ESPECIFIC,
    },
  },
  vite: {
    mode: process.argv.find((f) => f == "appMode"),
  },
  nitro: {
    preset: "iis-node",
  },
});
