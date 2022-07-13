import { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LotteryRound } from 'state/types'
import RewardBracketDetail from './RewardBracketDetail'

const Wrapper = styled(Flex)`
  width: 100%;
  flex-direction: column;
`

const RewardsInner = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  row-gap: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(4, 1fr);
  }
`

interface RewardMatchesProps {
  lotteryNodeData: LotteryRound
  isHistoricRound?: boolean
}

interface RewardsState {
  isLoading: boolean
  prizes: BigNumber[]
  prizesBN: BigNumber[]
}

const RewardBrackets: React.FC<RewardMatchesProps> = ({ lotteryNodeData, isHistoricRound }) => {
  const { t } = useTranslation()
  const [state, setState] = useState<RewardsState>({
    isLoading: true,
    prizes: [],
    prizesBN: [],
  })

  useEffect(() => {
    if (lotteryNodeData) {
      const { prizes } = lotteryNodeData

      const prizesToBN = prizes?.map((prize) => {
        return new BigNumber(prize?.toString())
      })
      setState({
        isLoading: false,
        prizes,
        prizesBN: prizesToBN,
      })
    } else {
      setState({
        isLoading: true,
        prizes: [],
        prizesBN: [],
      })
    }
  }, [lotteryNodeData])

  /*
  const getCakeRewards = (bracket: number) => {
    const shareAsPercentage = new BigNumber(state.rewardsBreakdown[bracket]).div(100)
    return state.rewardsLessTreasuryFee.div(100).times(shareAsPercentage)
  }
  */

  const { isLoading, prizesBN } = state

  // const rewardBrackets = [0, 1, 2, 3, 4, 5]

  return (
    <Wrapper>
      <Text fontSize="14px" mb="24px">
        {t('Match the winning number in the same order to share prizes.')}{' '}
        {!isHistoricRound && t('Current prizes up for grabs:')}
      </Text>
      <RewardsInner>
        {prizesBN.map((prize, index, i) => (
          <RewardBracketDetail
            key={i + 1}
            rewardBracket={i + 1}
            cakeAmount={!isLoading && prize}
            numberWinners={!isLoading && '1'}
            isHistoricRound={isHistoricRound}
            isLoading={isLoading}
          />
        ))}
        {/*
        <RewardBracketDetail rewardBracket={0} cakeAmount={cakeToBurn} isBurn isLoading={isLoading} />
        */}
      </RewardsInner>
    </Wrapper>
  )
}

export default RewardBrackets
