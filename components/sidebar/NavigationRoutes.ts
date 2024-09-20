export interface INavigationRoute {
  to: string;
  displayName: string;
  meta: { icon: string };
  children?: INavigationRoute[];
}

export default {
  root: {
    to: "/",
    displayName: "navigationRoutes.home",
  },
  routes: [
    {
      to: "/dashboard",
      displayName: "menu.dashboard",
      meta: {
        icon: "folder_open",
      },
    },
    {
      to: "/transactions",
      displayName: "menu.transactions",
      meta: {
        icon: "account_balance_wallet",
      },
    },
    // {
    //   to: 'sources',
    //   displayName: 'menu.sources',
    //   meta: {
    //     icon: 'drag_indicator',
    //   },
    // },
    // {
    //   to: 'budgets',
    //   displayName: 'menu.budgets',
    //   meta: {
    //     icon: 'local_atm',
    //   },
    // },
    // {
    //   to: 'loans',
    //   displayName: 'menu.loans',
    //   meta: {
    //     icon: 'local_atm',
    //   },
    // },
    // {
    //   name: 'preferences',
    //   displayName: 'menu.preferences',
    //   meta: {
    //     icon: 'manage_accounts',
    //   },
    // },
  ] as INavigationRoute[],
};
