import React from 'react'
import styled from 'styled-components'
import {
  CardBody,
  Flex,
  Text,
  useModal,
  CardRibbon,
  useMatchBreakpoints,
  BunnyPlaceholderIcon,
} from '@pancakeswap/uikit'
import { LotteryRound, WinningTickets } from 'state/types'
import { useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import WinningNumbers from '../WinningNumbers'
import ViewTicketsModal from '../ViewTicketsModal'

const StyledCardBody = styled(CardBody)`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Grid = styled.div`
  padding-top: 6px;
  position: relative;
  display: grid;
  grid-gap: 4px;
  /* Between 0 - 370px the team image is absolutely positioned so it starts as a 3-column grid */
  grid-template-columns: 50px 1fr;

  ${({ theme }) => theme.mediaQueries.xs} {
    padding-top: 20px;
    grid-template-columns: 50px 1fr;
    grid-gap: 8px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 2px;
    grid-template-columns: 80px 1fr;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 100px 1fr;
    grid-gap: 16px;
  }

  /* Between 968 - 1080px the team image is absolute positioned so it returns to a 3-column grid */
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 120px 1fr;
    grid-gap: 16px;
    min-height: 72px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: 120px 1fr;
    grid-gap: 16px;
  }
`

const StyledCardRibbon = styled(CardRibbon)`
  right: -20px;
  top: -20px;

  ${({ theme }) => theme.mediaQueries.xs} {
    right: -10px;
    top: -10px;
  }
`

const PreviousRoundCardBody: React.FC<{
  lotteryNodeData: LotteryRound
  lotteryId: string
  winningTickets: WinningTickets
}> = ({ lotteryNodeData, lotteryId, winningTickets }) => {
  const { t } = useTranslation()
  const {
    currentLotteryId,
    currentRound: { status },
  } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const userDataForRound = userLotteryData.rounds.find((userLotteryRound) => userLotteryRound.lotteryId === lotteryId)
  const { isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl

  const currentLotteryIdAsInt = parseInt(currentLotteryId)
  const mostRecentFinishedRoundId =
    status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
  const isLatestRound = mostRecentFinishedRoundId.toString() === lotteryId

  const topTen = winningTickets && winningTickets?.ticketNumber.slice(0, 10)

  return (
    <StyledCardBody>
      {isLatestRound && <StyledCardRibbon text={t('Latest')} />}
      <Grid>
        {topTen?.map((num, i) => (
          <React.Fragment key={num}>
            <Flex
              maxWidth={['20px', null, null, '100%']}
              ml={['4px', '8px', '16px']}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Text color="secondary" fontSize={isLargerScreen ? '42px' : '16px'} bold>
                #{i + 1}
              </Text>
            </Flex>
            <Flex maxWidth={['340px', null, null, '100%']} justifyContent={['center', null, null, 'flex-start']}>
              {lotteryId ? (
                <WinningNumbers
                  rotateText={isLargerScreen || false}
                  number={num}
                  mr={[null, null, null, '32px']}
                  size="100%"
                  fontSize={isLargerScreen ? '42px' : '16px'}
                />
              ) : (
                <Flex flexDirection="column" alignItems="center" width={['240px', null, null, '480px']}>
                  <Text mb="8px">{t('Please specify Round')}</Text>
                  <BunnyPlaceholderIcon height="64px" width="64px" />
                </Flex>
              )}
            </Flex>
          </React.Fragment>
        ))}
      </Grid>
    </StyledCardBody>
  )
}

export default PreviousRoundCardBody
