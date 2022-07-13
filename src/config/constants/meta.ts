import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'M&N Lottery',
  description: 'The most popular Lottery on BSC by user count! Earn BUSD in the Lottery! on a platform you can trust.',
  image:
    'https://www.canva.com/design/DAFDgvk6yqk/of2RJ-40JyCfsg3HPdfKqQ/view?utm_content=DAFDgvk6yqk&utm_campaign=designshare&utm_medium=link&utm_source=homepage_design_menu#28',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('M&N Lottery')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('M&N Lottery')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('M&N Lottery')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('M&N Lottery')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('M&N Lottery')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('M&N Lottery')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('M&N Lottery')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('M&N Lottery')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('M&N Lottery')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('M&N Lottery')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('M&N Lottery')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('M&N Lottery')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('M&N Lottery')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('M&N Lottery')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('M&N Lottery')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('M&N Lottery')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('M&N Lottery')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('M&N Lottery')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('PancakeSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('PancakeSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('PancakeSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('M&N Lottery')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('M&N Lottery')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Activity')} | ${t('M&N Lottery')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Profile')} | ${t('M&N Lottery')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('M&N Lottery')}`,
      }
    default:
      return null
  }
}
