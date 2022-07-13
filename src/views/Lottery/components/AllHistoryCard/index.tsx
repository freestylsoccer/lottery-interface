import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Card, Text, Skeleton, CardHeader, Box, Button, useModal, Flex, CardBody, Heading } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchLottery, fetchWinningTickets } from 'state/lottery/helpers'
import { LotteryStatus } from 'config/constants/types'
import RoundSwitcher from './RoundSwitcher'
import { getDrawnDate, processLotteryResponse } from '../../helpers'
import PreviousRoundCardBody from '../PreviousRoundCard/Body'
import PreviousRoundCardFooter from '../PreviousRoundCard/Footer'
import WithdrawModal from '../WithdrawFunds'
import ClaimRewardsModal from '../ClaimRewards'
import ExpandedGridItem from '../PreviousRoundCard/ExpandedGridItem'

const StyledCard = styled(Card)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const StyledCardHeader = styled(CardHeader)`
  z-index: 2;
  background: none;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

const StyledReferralRewards = styled(CardBody)`
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
const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column-gap: 20px;
    grid-row-gap: 36px;
    grid-template-columns: auto 1fr;
  }
`

const AllHistoryCard = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const {
    currentLotteryId,
    lotteriesData,
    currentRound: { status, isLoading },
  } = useLottery()
  const [latestRoundId, setLatestRoundId] = useState(null)
  const [selectedRoundId, setSelectedRoundId] = useState('')
  const [selectedLotteryNodeData, setSelectedLotteryNodeData] = useState(null)
  const [winningTickets, setWinningTickets] = useState(null)
  const [selectedLotteryStatus, setSelectedLotteryStatus] = useState(null)
  const timer = useRef(null)

  const numRoundsFetched = lotteriesData?.length

  const [onPresentWithdrawFundsModal] = useModal(<WithdrawModal roundId={selectedRoundId} />)

  const [onPresentClaimReferralRewardsModal] = useModal(<ClaimRewardsModal roundId={selectedRoundId} />)

  useEffect(() => {
    if (currentLotteryId) {
      const currentLotteryIdAsInt = currentLotteryId ? parseInt(currentLotteryId) : null
      const mostRecentFinishedRoundId =
        status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
      setLatestRoundId(mostRecentFinishedRoundId)
      setSelectedRoundId(mostRecentFinishedRoundId.toString())
    }
  }, [currentLotteryId, status])

  useEffect(() => {
    setSelectedLotteryNodeData(null)

    const fetchLotteryData = async () => {
      const lotteryData = await fetchLottery(selectedRoundId)
      const winningTicketsPerRound = await fetchWinningTickets(selectedRoundId)
      setWinningTickets(winningTicketsPerRound)
      const processedLotteryData = processLotteryResponse(lotteryData)
      setSelectedLotteryNodeData(processedLotteryData)
      setSelectedLotteryStatus(processedLotteryData.status)
    }

    timer.current = setInterval(() => {
      if (selectedRoundId) {
        fetchLotteryData()
      }
      clearInterval(timer.current)
    }, 1000)

    return () => clearInterval(timer.current)
  }, [selectedRoundId, currentLotteryId, numRoundsFetched, dispatch])

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event
    if (value) {
      setSelectedRoundId(value)
      if (parseInt(value, 10) <= 0) {
        setSelectedRoundId('')
      }
      if (parseInt(value, 10) >= latestRoundId) {
        setSelectedRoundId(latestRoundId.toString())
      }
    } else {
      setSelectedRoundId('')
    }
  }

  const handleArrowButtonPress = (targetRound) => {
    if (targetRound) {
      setSelectedRoundId(targetRound.toString())
    } else {
      // targetRound is NaN when the input is empty, the only button press that will trigger this func is 'forward one'
      setSelectedRoundId('1')
    }
  }

  return (
    <StyledCard>
      <StyledCardHeader>
        <RoundSwitcher
          isLoading={isLoading}
          selectedRoundId={selectedRoundId}
          mostRecentRound={latestRoundId}
          handleInputChange={handleInputChange}
          handleArrowButtonPress={handleArrowButtonPress}
        />
        <Box mt="8px">
          {selectedRoundId ? (
            selectedLotteryNodeData?.endTime ? (
              <Text fontSize="14px">
                {t('Drawn')} {getDrawnDate(locale, selectedLotteryNodeData.endTime)}
              </Text>
            ) : (
              <Skeleton width="185px" height="21px" />
            )
          ) : null}
        </Box>
      </StyledCardHeader>
      {selectedLotteryStatus === LotteryStatus.UNREALIZED && (
        <>
          <Box mt="8px">
            <Text fontSize="16px" textAlign="center">
              {t('The lottery did not take place because the minimum number of tickets to be sold was not reached')}
            </Text>
            <Text fontSize="16px" textAlign="center">
              {t('You can withdraw the funds equivalent to the number of tickets purchased for this round.')}
            </Text>
          </Box>
          {account && (
            <Flex alignItems="center" justifyContent="center">
              <Button
                onClick={onPresentWithdrawFundsModal}
                height="auto"
                width="fit-content"
                p="0"
                variant="text"
                scale="sm"
              >
                {t('Withdraw funds')}
              </Button>
            </Flex>
          )}
        </>
      )}

      <PreviousRoundCardBody
        lotteryNodeData={selectedLotteryNodeData}
        lotteryId={selectedRoundId}
        winningTickets={winningTickets}
      />
      <ExpandedGridItem
        lotteryNodeData={selectedLotteryNodeData}
        lotteryId={selectedRoundId}
        winningTickets={winningTickets}
      />
      {selectedLotteryStatus === LotteryStatus.CLAIMABLE && account && (
        <StyledReferralRewards>
          <Grid>
            <Box display={['none', null, null, 'flex']}>
              <Heading>{t('Your Rewards')}</Heading>
            </Box>
            <Flex
              flexDirection="column"
              mr={[null, null, null, '24px']}
              alignItems={['center', null, 'flex-start', 'flex-start']}
              mb="4px"
            >
              <Box mt={['4px', null, null, 0]}>
                <Text display="inline">{t('The referral rewards text')}</Text>
              </Box>
              <Button
                onClick={onPresentClaimReferralRewardsModal}
                height="auto"
                width="fit-content"
                p="0"
                variant="text"
                scale="sm"
              >
                {t('View referral rewards')}
              </Button>
            </Flex>
          </Grid>
        </StyledReferralRewards>
      )}
      <PreviousRoundCardFooter lotteryNodeData={selectedLotteryNodeData} lotteryId={selectedRoundId} />
    </StyledCard>
  )
}

export default AllHistoryCard
