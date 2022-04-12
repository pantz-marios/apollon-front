import { PopupItem } from "../../service/popup-item.model";





export interface PopupMenuItem {
    text: string;
    iconSrc: string;
    items?: PopupMenuItem[];
    separator?: boolean;
    onClick?: (context: any) => void;
    
    parentPopupItem?: PopupMenuItem;
    popupItem?: PopupItem;                // the PopupItem that contains this PopupMenuItem 
    childPopupItem?: PopupItem;           // the PopupItem that is created from this PopupMenuItem  
};
