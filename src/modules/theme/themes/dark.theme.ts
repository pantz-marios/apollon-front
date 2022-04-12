import { Theme } from "../service/theme.model";





export const DARK_THEME: Theme = {
   name: 'dark',
   properties: {
    // generic colors
    '--primary-background-color': '#050505',
    '--secondary-background-color': '#161616',

    '--primary-font-color': '#f0f0f0',
    '--secondary-font-color': '#808080',

    '--primary-border-color': '#252525',
    '--secondary-border-color': '#252525',





    // secondary button
    '--secondary-button-background-color': '#202020',
    '--secondary-button-foreground-color': '#808080',
    '--secondary-button-background-color-hover': '#282828',
    '--secondary-button-background-color-active': '#404040',

    // icon button
    '--icon-button-background-color': '#ffffff00',
    '--icon-button-foreground-color': '#808080',
    '--icon-button-background-color-hover': '#404040',
    '--icon-button-background-color-active': '#505050',





    // search bar
    '--searchbar-shadow-color': '#252525',
      
    // player buttons
    '--player-primary-color': '#f0f0f0',
    '--player-primary-color-active': '#d0d0d0',
    '--player-primary-shadow-color-hover': '#808080',

    // player video title
    '--player-video-title-font-color': '#c0c0c0',

    // topbar buttons
    '--topbar-button-background-color': '#050505',
    '--topbar-button-foreground-color': '#808080',
    '--topbar-button-background-color-hover': '#404040',
    '--topbar-button-background-color-active': '#202020',

    // item buttons
    '--grid-item-options-button-background-color': '#00000000',
    '--grid-item-options-button-foreground-color': '#808080',
    '--grid-item-options-button-background-color-hover': '#404040',
    '--grid-item-options-button-background-color-active': '#202020',

    // grid item thumbnail shadow
    '--grid-item-thumbnail-shadow-color-hover': '#303030',

    // main nav menu
    '--main-nav-menu-item-background-color': '#00000000',
    '--main-nav-menu-item-foreground-color': '#808080',           // '#72777a',
    '--main-nav-menu-item-icon-color': '#808080',
    '--main-nav-menu-item-background-color-hover': '#282828',
    // '--main-nav-menu-item-background-color-active': '#202020',
    '--main-nav-menu-item-background-color-selected': '#404040',




    // queue table
    '--queue-table-background-color': '#161616',
    '--queue-table-primary-foreground-color': '#c0c0c0',
    '--queue-table-secondary-foreground-color': '#808080',
    '--queue-table-background-color-hover': '#282828',
    '--queue-table-background-color-selected': '#3e4466'

  }
};