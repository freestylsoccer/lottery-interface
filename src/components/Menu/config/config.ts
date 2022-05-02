import { MenuItemsType, DropdownMenuItemType, TrophyIcon, TrophyFillIcon, MoreIcon } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t'], languageCode?: string) => ConfigMenuItemsType[] = (t, languageCode) => [
  {
    label: t('Lottery'),
    href: '/lottery',
    icon: TrophyIcon,
    fillIcon: TrophyFillIcon,
  },
  {
    label: 'Blog',
    href: 'https://medium.com/pancakeswap',
    type: DropdownMenuItemType.EXTERNAL_LINK,
    icon: MoreIcon,
    hideSubNav: true,
  },
  {
    label: 'Docs',
    href: 'https://docs.pancakeswap.finance',
    type: DropdownMenuItemType.EXTERNAL_LINK,
    icon: MoreIcon,
    hideSubNav: true,
  },
]

export default config
