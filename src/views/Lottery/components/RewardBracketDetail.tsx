import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
// import { usePriceCakeBusd } from 'state/farms/hooks'
import Balance from 'components/Balance'
import { getBalanceNumber } from 'utils/formatBalance'

interface RewardBracketDetailProps {
  cakeAmount: BigNumber
  rewardBracket?: number
  numberWinners?: string
  isBurn?: boolean
  isHistoricRound?: boolean
  isLoading?: boolean
}

const RewardBracketDetail: React.FC<RewardBracketDetailProps> = ({
  rewardBracket,
  cakeAmount,
  numberWinners,
  isHistoricRound,
  isBurn,
  isLoading,
}) => {
  const { t } = useTranslation()
  // const cakePriceBusd = usePriceCakeBusd()

  const getRewardText = () => {
    const numberMatch = rewardBracket + 1
    if (isBurn) {
      return t('Burn')
    }
    return t('Prize #%numberMatch%', { numberMatch })
  }

  return (
    <Flex flexDirection="column">
      {isLoading ? (
        <Skeleton mb="4px" mt="8px" height={16} width={80} />
      ) : (
        <Text bold color={isBurn ? 'failure' : 'secondary'}>
          {getRewardText()}
        </Text>
      )}
      <>
        {isLoading || cakeAmount.isNaN() ? (
          <Skeleton my="4px" mr="10px" height={20} width={110} />
        ) : (
          <Balance fontSize="20px" bold unit=" BUSD" value={getBalanceNumber(cakeAmount)} decimals={0} />
        )}
        {isLoading || cakeAmount.isNaN() ? (
          <>
            <Skeleton mt="4px" mb="16px" height={12} width={70} />
          </>
        ) : (
          <Balance fontSize="12px" color="textSubtle" prefix="~$" value={getBalanceNumber(cakeAmount)} decimals={0} />
        )}
        {isHistoricRound && cakeAmount && (
          <>
            <Text fontSize="12px" color="textSubtle">
              {numberWinners} {t('Winning Ticket')}
            </Text>
          </>
        )}
      </>
    </Flex>
  )
}

export default RewardBracketDetail
