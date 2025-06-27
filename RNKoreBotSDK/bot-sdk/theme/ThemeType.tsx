export interface ThemeType {
  _id?: string;
  streamId?: string;
  __v?: number;
  activeTheme?: boolean;
  createdBy?: string;
  createdOn?: string;
  defaultTheme?: boolean;
  lastModifiedBy?: string;
  lastModifiedOn?: string;
  refId?: string;
  state?: string;
  themeName?: string;
  v3?: {
    general?: {
      bot_icon?: string;
      size?: string;
      themeType?: string;
      colors?: {
        primary?: string;
        secondary?: string;
        primary_text?: string;
        secondary_text?: string;
        useColorPaletteOnly?: boolean;
      };
    };
    chat_bubble?: {
      style?: string;
      icon?: {
        icon_url?: string;
        size?: string;
        type?: string;
      };
      minimise?: {
        icon?: string;
        theme?: string;
        type?: string;
      };
      sound?: string;
      alignment?: string;
      animation?: string;
      expand_animation?: string;
      primary_color?: string;
      secondary_color?: string;
    };
    welcome_screen?: {
      show?: boolean;
      layout?: string;
      logo?: {
        logo_url?: string;
      };
      title?: {
        name?: string;
      };
      sub_title?: {
        name?: string;
      };
      note?: {
        name?: string;
      };
      background?: {
        type?: string;
        color?: string;
        img?: string;
      };
      top_fonts?: {
        color?: string;
      };
      bottom_background?: {
        color?: string;
      };
      templates?: any;
      starter_box?: {
        show?: boolean;
        icon?: {
          show?: boolean;
        };
        title?: string;
        sub_text?: string;
        start_conv_button?: {
          color?: string;
        };
        start_conv_text?: {
          color?: string;
        };
        quick_start_buttons?: {
          show?: boolean;
          style?: string;
          buttons?: any;
          input?: string;
          action?: {
            type?: string;
            value?: string;
          };
        };
      };
      static_links?: {
        show?: boolean;
        layout?: string;
        links?: any;
      };
      promotional_content?: {
        show?: boolean;
        promotions?: any;
      };
    };
    header?: {
      bg_color?: string;
      size?: string;
      icon?: {
        show?: boolean;
        icon_url?: string;
        type?: string;
      };
      icons_color?: string;
      title?: {
        name?: string;
        color?: string;
      };
      sub_title?: {
        name?: string;
        color?: string;
      };
      buttons?: {
        close?: {
          show?: boolean;
          icon?: string;
        };
        minimise?: {
          show?: boolean;
          icon?: string;
        };
        expand?: {
          show?: boolean;
          icon?: string;
        };
        reconnect?: {
          show?: boolean;
          icon?: string;
        };
        threeDots?: {
          show?: boolean;
          icon?: string;
        };
        help?: {
          show?: boolean;
          action?: {
            type?: string;
            value?: string;
            icon?: string;
          };
        };
        live_agent?: {
          show?: boolean;
          action?: {
            type?: string;
            value?: string;
            icon?: string;
          };
        };
      };
    };
    footer?: {
      bg_color?: string;
      layout?: string;
      compose_bar?: {
        bg_color?: string;
        'outline-color'?: string;
        placeholder?: string;
      };
      icons_color?: string;
      buttons?: {
        menu?: {
          show?: boolean;
          icon_color?: string;
          actions?: any;
        };
        emoji?: {
          show?: boolean;
          icon?: string;
        };
        microphone?: {
          show?: boolean;
          icon?: string;
        };
        speaker: {
          show: boolean;
          icon: string;
        };
        attachment?: {
          show?: boolean;
          icon?: string;
        };
      };
    };
    body?: {
      background?: {
        type?: string;
        color?: string;
        img?: string;
      };
      font?: {
        family?: string;
        size?: string; //'small' | 'medium' | 'large';
        style?: string;
      };
      user_message?: {
        bg_color?: string;
        color?: string;
      };
      bot_message?: {
        bg_color?: string;
        color?: string;
      };
      agent_message?: {
        bg_color?: string;
        color?: string;
        separator?: string;
        icon?: {
          show?: string;
          icon_url?: string;
        };
        title?: {
          name?: string;
          color?: string;
        };
        sub_title?: {
          name?: string;
          color?: string;
        };
      };
      time_stamp?: {
        show?: boolean;
        show_type?: string;
        position?: string;
        separator?: string;
        color?: string;
      };
      icon?: {
        show?: boolean;
        user_icon?: boolean;
        bot_icon?: boolean;
        agent_icon?: boolean;
      };
      buttons?: {
        bg_color?: string;
        color?: string;
      };
      bubble_style?: string; //'balloon' | 'rounded' | 'rectangle';
      primaryColor?: string;
      primaryHoverColor?: string;
      secondaryColor?: string;
      secondaryHoverColor?: string;
      img?: string;
    };
  };
  version?: string;
}
