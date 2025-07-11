import {IThemeType} from './IThemeType';

export const defaultTheme: IThemeType = {
  _id: 'wsth-b578c51a-0518-57ad-bbb3-7f404a053528',
  streamId: 'st-b0439232-9345-508f-a1fb-cfcb5099c1fa',
  __v: 0,
  activeTheme: true,
  createdBy: 'u-e10dd737-167e-5e46-88d0-a2b55394f0f3',
  createdOn: '2023-11-28T09:33:19.921Z',
  defaultTheme: true,
  lastModifiedBy: 'u-e10dd737-167e-5e46-88d0-a2b55394f0f3',
  lastModifiedOn: '2023-11-28T11:05:43.265Z',
  refId: '06ad9db9-fb35-5632-b9b1-7dabacc323b1',
  state: 'published',
  themeName: 'Default dark theme 2',
  v3: {
    general: {
      bot_icon: 'url',
      size: 'small',
      themeType: 'light',
      colors: {
        primary: '#a37645',
        secondary: '#101828',
        primary_text: '#ffffff',
        secondary_text: '#1d2939',
        useColorPaletteOnly: false,
      },
    },
    chat_bubble: {
      style: 'rounded',
      icon: {
        icon_url: 'icon-1.svg',
        size: 'medium',
        type: 'default',
      },
      minimise: {
        icon: 'm-icon-1.svg',
        theme: 'rounded',
        type: 'default',
      },
      sound: 'themeOne',
      alignment: 'block',
      animation: 'slide',
      expand_animation: 'quick',
      primary_color: '#a37645',
      secondary_color: '#1d2939',
    },
    welcome_screen: {
      show: true,
      layout: 'medium',
      logo: {
        logo_url: '/images/sc-small.svg',
      },
      title: {
        name: 'Hello',
      },
      sub_title: {
        name: 'Welcome to Kore.ai',
      },
      note: {
        name: 'Our Community is ready to help you to join our best platform',
      },
      background: {
        type: 'color',
        color: '#a37645',
        img: 'https://picsum.photos/seed/picsum/200/300',
      },
      top_fonts: {
        color: '#ffffff',
      },
      bottom_background: {
        color: '#1d2939',
      },
      templates: [],
      starter_box: {
        show: true,
        icon: {
          show: true,
        },
        title: 'Start New Conversation',
        sub_text: "I'm your personal assistant I'm here to help",
        start_conv_button: {
          color: '#a37645',
        },
        start_conv_text: {
          color: '#ffffff',
        },
        quick_start_buttons: {
          show: true,
          style: 'slack',
          buttons: [
            {
              title: 'Contact Sales',
              action: {
                type: 'postback',
                value: 'Contact Sales',
              },
            },
            {
              title: 'Free Trail',
              action: {
                type: 'postback',
                value: 'Free Trail',
              },
            },
            {
              title: 'Support',
              action: {
                type: 'postback',
                value: 'Support',
              },
            },
            {
              title: 'Hours of Operation',
              action: {
                type: 'postback',
                value: 'Hours of Operation',
              },
            },
            {
              title: 'Kore.ai',
              action: {
                type: 'postback',
                value: 'https://kore.ai/',
              },
            },
          ],
          input: 'button',
          action: {
            type: 'postback',
            value: 'Hello',
          },
        },
      },
      static_links: {
        show: true,
        layout: 'carousel',
        links: [
          {
            title: 'Kore.ai',
            description:
              'Kore.ai automates front-office and back-office interactions',
            action: {
              type: 'url',
              value: 'https://kore.ai/',
            },
          },
          {
            title: 'Kore',
            description:
              'Kore.ai automates front-office and back-office interactions',
            action: {
              type: 'url',
              value: 'https://kore.ai/',
            },
          },
        ],
      },
      promotional_content: {
        show: true,
        promotions: [
          {
            banner: 'https://picsum.photos/seed/picsum/200/300',
            action: {
              type: 'url',
              value: 'http://abc.com',
            },
          },
          {
            banner: 'https://picsum.photos/seed/picsum/200/300',
            action: {
              type: 'url',
              value: 'http://abc.com',
            },
          },
        ],
      },
    },
    header: {
      bg_color: '#EAECF0',
      size: 'compact',
      icon: {
        show: true,
        icon_url: '/images/avatar-bot.svg',
        //icon_url : "icon-1"
        type: 'default',
      },
      icons_color: '#000000',
      title: {
        name: 'Support',
        color: '#000000',
      },
      sub_title: {
        name: 'Your personal assistant',
        color: '#000000',
      },
      buttons: {
        close: {
          show: true,
          icon: '/images/close-large.svg',
        },
        minimise: {
          show: true,
          icon: 'url|icomoon',
        },
        expand: {
          show: false,
          icon: 'url|icomoon',
        },
        reconnect: {
          show: false,
          icon: 'url|icomoon',
        },
        help: {
          show: true,
          action: {
            type: 'postback|url',
            value: 'https://kore.ai',
            icon: 'url|icomoon',
          },
        },
        live_agent: {
          show: true,
          action: {
            type: 'postback|url',
            value: 'https://kore.ai',
            icon: 'url|icomoon',
          },
        },
      },
    },
    footer: {
      bg_color: '#EAECF0',
      layout: 'keypad',
      compose_bar: {
        bg_color: '#fffffe',
        'outline-color': '#E5E5E5',
        placeholder: 'Type a message',
      },
      icons_color: '#000000',
      buttons: {
        menu: {
          show: true,
          icon_color: '#000000',
          actions: [
            {
              title: 'About',
              type: 'postback',
              value: 'About',
              icon: 'url|icomoon',
            },
            {
              title: 'Kore.ai',
              type: 'url',
              value: 'https://kore.ai/',
              icon: 'url|icomoon',
            },
          ],
        },
        emoji: {
          show: true,
          icon: 'url|icomoon',
        },
        microphone: {
          show: true,
          icon: 'url|icomoon',
        },
        speaker: {
          show: false,
          icon: '',
        },
        attachment: {
          show: true,
          icon: 'url|icomoon',
        },
      },
    },
    body: {
      background: {
        type: 'color',
        color: '#FFFFFF',
        img: 'https://picsum.photos/id/237/200/300',
      },
      font: {
        family: 'Inter',
        size: 'medium',
        style: '1|2|3',
      },
      user_message: {
        bg_color: '#a37645',
        color: '#FFFFFF',
      },
      bot_message: {
        bg_color: '#4B4EDE',
        color: '#ffffff',
      },
      agent_message: {
        bg_color: '#4B4EDE',
        color: '#0D6EFD',
        separator: '2',
        icon: {
          show: 'true|false',
          icon_url: 'icomoon|url',
        },
        title: {
          name: 'Agent Support',
          color: '#1d2939',
        },
        sub_title: {
          name: 'Agent support',
          color: '#0D6EFD',
        },
      },
      time_stamp: {
        show: true,
        show_type: 'always',
        position: 'bottom',
        separator: 'line',
        color: '#1d2939',
      },
      icon: {
        show: true,
        user_icon: false,
        bot_icon: true,
        agent_icon: true,
      },
      buttons: {
        bg_color: '#a37645',
        color: 'white',
      },
      bubble_style: 'balloon',
      primaryColor: '#3f42d4',
      primaryHoverColor: '#de4bbc',
      secondaryColor: '#3639e6',
      secondaryHoverColor: '#b1b2f9',
      img: '6495705b0d5bbd027d2e39ad',
    },
  },
  version: '3.0.0',
};
