import * as React from 'react';

export interface IBotChatContext {
  actionSheet(): {showActionSheetWithOptions: (option?: any, cb?: any) => any};
  getLocale(): string;
}

export const BotChatContext = React.createContext<IBotChatContext>({
  getLocale: () => 'en',
  actionSheet: () => ({
    showActionSheetWithOptions: () => {},
  }),
});

export const useChatContext = () => React.useContext(BotChatContext);
