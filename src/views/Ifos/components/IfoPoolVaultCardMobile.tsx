import { Box, Card, CardBody, CardHeader, ExpandableButton, Flex, Text, Message, Button } from '@pancakeswap/uikit'
import { ActionContainer } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import Balance from 'components/Balance'
import { TokenPairImage } from 'components/TokenImage'
import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'
import { DeserializedPool } from 'state/types'
import { convertSharesToCake, getCakeVaultEarnings } from 'views/Pools/helpers'

const StyledCardMobile = styled(Card)`
  max-width: 400px;
  width: 100%;
`

const StyledTokenContent = styled(Flex)`
  ${Text} {
    line-height: 1.2;
    white-space: nowrap;
  }
`

const StyledCardBody = styled(CardBody)`
  display: grid;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  gap: 16px;
  ${ActionContainer} {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.invertedContrast};
  }
`

const StyledEndedTag = styled.div`
  position: absolute;
  top: 15px;
  left: -20px;
  width: 100px;
  transform: rotate(318deg);
  color: white;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.failure};
  z-index: 7;
  padding: 2px 0;
`
interface IfoPoolVaultCardMobileProps {
  account: string
  pool: DeserializedPool
}

const IfoPoolVaultCardMobile: React.FC<IfoPoolVaultCardMobileProps> = ({ account, pool }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <StyledCardMobile isActive>
      <CardHeader p="16px">
        <StyledEndedTag>{t('Ended')}</StyledEndedTag>
        <Flex justifyContent="space-between" alignItems="center">
          <StyledTokenContent alignItems="center" flex={1}>
            <TokenPairImage width={24} height={24} primaryToken={tokens.cake} secondaryToken={tokens.cake} />
            <Box ml="8px">
              <Text small bold>
                {t('IFO CAKE')}
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {t('Stake')} CAKE
              </Text>
            </Box>
          </StyledTokenContent>
        </Flex>
      </CardHeader>
    </StyledCardMobile>
  )
}

export default IfoPoolVaultCardMobile
