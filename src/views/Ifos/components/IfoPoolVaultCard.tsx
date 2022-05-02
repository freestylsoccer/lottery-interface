import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { VaultKey } from 'state/types'
import { useMatchBreakpoints } from '@pancakeswap/uikit'

import IfoPoolVaultCardDesktop from './IfoPoolVaultCardDesktop'
import IfoPoolVaultCardMobile from './IfoPoolVaultCardMobile'

const IfoPoolVaultCard = () => {
  const { account } = useWeb3React()
  const { isMd, isXs, isSm } = useMatchBreakpoints()
  const isSmallerThanTablet = isMd || isXs || isSm

  // const ifoPool = useMemo(() => ({ ...data, vaultKey: VaultKey.IfoPool }), [data])

  if (isSmallerThanTablet) {
    return <IfoPoolVaultCardMobile account={account} pool={undefined} />
  }

  return <IfoPoolVaultCardDesktop account={account} pool={undefined} />
}

export default IfoPoolVaultCard
