import { Box, Card, CardBody, CardHeader, Flex, Text, Message, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import { TokenPairImage } from 'components/TokenImage'
import { useRouter } from 'next/router'
import { DeserializedPool } from 'state/types'
import { convertSharesToCake, getCakeVaultEarnings } from 'views/Pools/helpers'

const StyledCardDesktop = styled(Card)`
  width: 100%;
  align-self: flex-start;
`

const StyledTokenContent = styled(Flex)`
  ${Text} {
    line-height: 1.2;
    white-space: nowrap;
  }
`

const StyledCardBody = styled(CardBody)`
  padding: 24px;
`

const StyledEndedTag = styled.div`
  position: absolute;
  top: 20px;
  right: -30px;
  width: 120px;
  transform: rotate(-318deg);
  color: white;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.failure};
  z-index: 7;
  padding: 4px 0;
`

interface IfoPoolVaultCardDesktopProps {
  account: string
  pool: DeserializedPool
}

const IfoPoolVaultCardDesktop: React.FC<IfoPoolVaultCardDesktopProps> = ({ account, pool }) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <StyledCardDesktop>
      <CardHeader p="16px">
        <StyledEndedTag>{t('Ended')}</StyledEndedTag>
        <StyledTokenContent justifyContent="space-between" alignItems="center">
          <Box ml="8px">
            <Text fontSize="24px" color="secondary" bold>
              {t('IFO CAKE')}
            </Text>
            <Text color="textSubtle" fontSize="14px">
              {t('Stake CAKE to participate in IFO')}
            </Text>
          </Box>
          <TokenPairImage width={64} height={64} primaryToken={tokens.cake} secondaryToken={tokens.cake} />
        </StyledTokenContent>
      </CardHeader>
    </StyledCardDesktop>
  )
}

export default IfoPoolVaultCardDesktop
