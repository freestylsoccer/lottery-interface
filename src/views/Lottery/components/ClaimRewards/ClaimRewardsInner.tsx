import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Flex, Button, Text, AutoRenewIcon, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceAmount } from 'utils/formatBalance'
import { callWithEstimateGas } from 'utils/calls'
import { useGasPrice } from 'state/user/hooks'
import { fetchHasReferralRewards } from 'state/lottery/helpers'

import Balance from 'components/Balance'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useLotteryV2Contract } from 'hooks/useContract'
import { HasReferralRewards } from 'state/types'

interface WithdrawInnerProps {
  roundId: string
  onSuccess?: () => void
}

const WithdrawInnerContainer: React.FC<WithdrawInnerProps> = ({ onSuccess, roundId }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const gasPrice = useGasPrice()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [referralRewardsData, sethHasReferralRewards] = useState<HasReferralRewards>(undefined)
  const [isFetched, setIsFetched] = useState(false)
  const lotteryContract = useLotteryV2Contract()

  const cakeReward = new BigNumber(referralRewardsData?.amount)

  const dollarReward = cakeReward
  const rewardAsBalance = getBalanceAmount(cakeReward).toNumber()
  const dollarRewardAsBalance = getBalanceAmount(dollarReward).toNumber()

  useEffect(() => {
    const fetchData = async () => {
      const hasRewards = await fetchHasReferralRewards(roundId, account)
      sethHasReferralRewards(hasRewards)
      if (hasRewards) {
        setIsFetched(true)
      } else {
        setIsFetched(false)
      }
    }

    fetchData()
  }, [roundId, account])

  const handleClaim = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithEstimateGas(lotteryContract, 'distributeReferralRewards', [roundId], {
        gasPrice,
      })
    })
    if (receipt?.status) {
      toastSuccess(
        t('Withdrawn funds!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your referral rewards in BUSD for round %roundId% have been sent to your wallet', { roundId })}
        </ToastDescriptionWithTx>,
      )
      onSuccess()
    }
  }

  return (
    <>
      <Flex flexDirection="column">
        {rewardAsBalance > 0 ? (
          <>
            <Text mb="4px" textAlign={['center', null, 'left']}>
              {t('Referral Rewards Amount')}
            </Text>
            <Flex
              alignItems={['flex-start', null, 'center']}
              justifyContent={['flex-start', null, 'space-between']}
              flexDirection={['column', null, 'row']}
            >
              <Balance
                textAlign={['center', null, 'left']}
                lineHeight="1.1"
                value={rewardAsBalance}
                fontSize="44px"
                bold
                color="secondary"
                unit=" BUSD"
              />
            </Flex>
            <Balance
              mt={['12px', null, '0']}
              textAlign={['center', null, 'left']}
              value={dollarRewardAsBalance}
              fontSize="12px"
              color="textSubtle"
              unit=" USD"
              prefix="~"
            />
          </>
        ) : (
          <Text mt="8px" fontSize="16px" color="secondary" textAlign={['center', null, 'center']}>
            {isFetched ? t('No referral rewards for this round') : <Skeleton width="100%" height="24px" />}
          </Text>
        )}
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        <Text mt="8px" fontSize="12px" color="textSubtle">
          {t('Round')} #{roundId}
        </Text>
      </Flex>

      {rewardAsBalance > 0 && (
        <Flex alignItems="center" justifyContent="center">
          <Button
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            mt="20px"
            width="100%"
            onClick={() => handleClaim()}
          >
            {pendingTx ? t('Claiming') : t('Claim')}
          </Button>
        </Flex>
      )}
    </>
  )
}

export default WithdrawInnerContainer
