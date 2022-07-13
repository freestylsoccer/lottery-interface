import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  CardBody,
  Heading,
  Flex,
  Skeleton,
  ExpandableLabel,
  Text,
  Box,
  Button,
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
  padding-top: 0px;
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
    grid-template-columns: 50px 1fr;
    grid-gap: 8px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(6, auto);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(6, auto);
  }

  /* Between 968 - 1080px the team image is absolute positioned so it returns to a 3-column grid */
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(6, auto);
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: repeat(6, auto);
  }
`

const ExpandedWrapper = styled.div`
  /* Between 576 - 852px - the expanded wrapper shows as a three-column grid */
  ${({ theme }) => theme.mediaQueries.sm} {
    display: grid;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    display: grid;
  }

  /* Above 1080px - it should again show as a three-column grid */
  ${({ theme }) => theme.mediaQueries.xl} {
    display: grid;
  }
`

const StyledUserTickets = styled(CardBody)`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`
const StyledUserTicketsGrid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column-gap: 32px;
    grid-row-gap: 36px;
    grid-template-columns: auto 1fr;
  }
`

const ExpandedGridItem: React.FC<{
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

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!lotteryId) {
      setIsExpanded(false)
    }
  }, [lotteryId])
  const currentLotteryIdAsInt = parseInt(currentLotteryId)
  const mostRecentFinishedRoundId =
    status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
  const isLatestRound = mostRecentFinishedRoundId.toString() === lotteryId

  const [onPresentViewTicketsModal] = useModal(
    <ViewTicketsModal roundId={lotteryId} roundStatus={lotteryNodeData?.status} />,
  )

  const totalTicketNumber = userDataForRound ? userDataForRound.totalTickets : 0
  const ticketRoundText =
    totalTicketNumber > 1
      ? t('You had %amount% tickets this round', { amount: totalTicketNumber })
      : t('You had %amount% ticket this round', { amount: totalTicketNumber })
  const [youHadText, ticketsThisRoundText] = ticketRoundText.split(totalTicketNumber.toString())
  const nextNinety = winningTickets && winningTickets?.ticketNumber.slice(10, 90)

  return (
    <>
      {isExpanded && (
        <StyledCardBody>
          <ExpandedWrapper>
            <Grid>
              {nextNinety?.map((num, i) => (
                <React.Fragment key={num}>
                  <Flex
                    maxWidth={['20px', null, null, '100%']}
                    ml={['4px', '8px', '16px']}
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Text color="secondary" fontSize={isLargerScreen ? '16px' : '16px'} bold>
                      #{i + 11}
                    </Text>
                  </Flex>
                  <Flex maxWidth={['340px', null, null, '100%']} justifyContent={['center', null, null, 'flex-start']}>
                    {lotteryId ? (
                      <WinningNumbers
                        rotateText={isLargerScreen || false}
                        number={num}
                        mr={[null, null, null, '32px']}
                        size="100%"
                        fontSize={isLargerScreen ? '16px' : '16px'}
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
          </ExpandedWrapper>
        </StyledCardBody>
      )}
      {nextNinety?.length > 0 && (
        <Flex p="8px 24px" alignItems="center" justifyContent="center">
          <ExpandableLabel
            expanded={isExpanded}
            onClick={() => {
              if (lotteryId) {
                setIsExpanded(!isExpanded)
              }
            }}
          >
            {isExpanded ? (
              <Text color="secondary" fontWeight="600">
                {t('Hide')}
              </Text>
            ) : (
              <Text color="secondary" fontWeight="600">
                {t('Show More')}
              </Text>
            )}
          </ExpandableLabel>
        </Flex>
      )}
      {userDataForRound && (
        <StyledUserTickets>
          <StyledUserTicketsGrid>
            <Box display={['none', null, null, 'flex']}>
              <Heading>{t('Your tickets')}</Heading>
            </Box>
            <Flex
              flexDirection="column"
              mr={[null, null, null, '24px']}
              alignItems={['center', 'center', 'flex-start', 'flex-start']}
            >
              <Box mt={['4px', null, null, 0]}>
                <Text display="inline">{youHadText} </Text>
                <Text display="inline" bold>
                  {userDataForRound.totalTickets}
                </Text>
                <Text display="inline">{ticketsThisRoundText}</Text>
              </Box>
              <Button
                onClick={onPresentViewTicketsModal}
                height="auto"
                width="fit-content"
                p="0"
                variant="text"
                scale="sm"
              >
                {t('View your tickets')}
              </Button>
            </Flex>
          </StyledUserTicketsGrid>
        </StyledUserTickets>
      )}
    </>
  )
}

export default ExpandedGridItem
