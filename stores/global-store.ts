import { type Settings } from "~/types/settings";
import { type User } from "~/types/auth";
// import AccountService from '../api/transactions/account.service'
// import { Source } from '../pages/sources/types'
import { defineStore } from "pinia";

export type LanguageMap = Record<string, string>;

export const languages: LanguageMap = {
  english: "English",
  spanish: "Spanish",
};

const settings: Settings =
  typeof localStorage !== "undefined"
    ? JSON.parse(
        localStorage.getItem("settings") ?? '{"lang":"es","theme":"dark"}'
      )
    : { lang: "es", theme: "dark" };

export const useGlobalStore = defineStore("global", {
  state: () => {
    const { locale } = useI18n();
    console.log(settings);
    locale.value = settings.lang;

    const languageCodes: { [id: string]: string } = {
      gb: languages.english,
      es: languages.spanish,
    };

    return {
      locale: locale,
      isSidebarMinimized: false,
      settings: settings,
      languageCodes,
    };
  },

  actions: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized;
    },
    async setTheme(theme: string, user: User | null) {
      this.settings.theme = theme;
      localStorage.setItem("settings", JSON.stringify(settings));
      if (user != null) {
        // await AccountService.SetSettings(
        //   user.token,
        //   user.accountId,
        //   JSON.stringify(this.settings)
        // );
      }
    },

    setConfig(config: string | undefined) {
      if (config != undefined) {
        this.settings = JSON.parse(config);
        this.locale = this.settings.lang;
        localStorage.setItem("settings", JSON.stringify(this.settings));
      } else {
        this.settings = { lang: "es", theme: "dark" };
      }
    },
    // async setLoanSource(source: Source, user: User | null) {
    //   this.settings.loanSource = source;
    //   localStorage.setItem("settings", JSON.stringify(this.settings));
    //   if (user != null) {
    //     await AccountService.SetSettings(
    //       user.token,
    //       user.accountId,
    //       JSON.stringify(this.settings)
    //     );
    //   }
    // },
  },
});
