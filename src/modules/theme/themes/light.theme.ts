import { Theme } from "../service/theme.model";





export const LIGHT_THEME: Theme = {
  name: 'light',
  properties: {
    // generic colors
    '--primary-background-color': '#fafafa',
    '--secondary-background-color': '#ffffff',

    '--primary-font-color': '#000000',
    '--secondary-font-color': '#808080',

    '--primary-border-color': '#f0f0f0',
    '--secondary-border-color': '#e0e0e0',





    // secondary button
    '--secondary-button-background-color': '#e8e8e8',
    '--secondary-button-foreground-color': '#505050',
    '--secondary-button-background-color-hover': '#e0e0e0',
    '--secondary-button-background-color-active': '#d0d0d0',


    // icon button
    '--icon-button-background-color': '#ffffff00',
    '--icon-button-foreground-color': '#000000',
    '--icon-button-background-color-hover': '#e0e0e0',
    '--icon-button-background-color-active': '#d0d0d0',




      
    // search bar
    '--searchbar-shadow-color': 'rgba(0, 0, 0, 0.10)',

    // player buttons
    '--player-primary-color': '#303030',
    '--player-primary-color-active': '#000000',
    '--player-primary-shadow-color-hover': '#808080',

    // player video title
    '--player-video-title-font-color': '#303030',

    // topbar buttons
    '--topbar-button-background-color': '#fafafa',
    '--topbar-button-foreground-color': '#000000',
    '--topbar-button-background-color-hover': '#f0f0f0',
    '--topbar-button-background-color-active': '#e0e0e0',

    // grid item options button
    '--grid-item-options-button-background-color': '#00000000',
    '--grid-item-options-button-foreground-color': '#000000',
    '--grid-item-options-button-background-color-hover': '#f0f0f0',
    '--grid-item-options-button-background-color-active': '#e0e0e0',

    // grid item thumbnail shadow
    '--grid-item-thumbnail-shadow-color-hover': '#a0a0a0',

    // main nav menu
    '--main-nav-menu-item-background-color': '#00000000',
    '--main-nav-menu-item-foreground-color': '#505050',
    '--main-nav-menu-item-icon-color': '#000000',
    '--main-nav-menu-item-background-color-hover': '#f0f0f0',
    // '--main-nav-menu-item-background-color-active': '#e0e0e0',
    '--main-nav-menu-item-background-color-selected': '#f0f0f0',





    // queue table
    '--queue-table-background-color': '#ffffff',
    '--queue-table-primary-foreground-color': '#303030',
    '--queue-table-secondary-foreground-color': '#808080',
    '--queue-table-background-color-hover': '#f0f0f0',
    '--queue-table-background-color-selected': '#c4cdff'

  }
};