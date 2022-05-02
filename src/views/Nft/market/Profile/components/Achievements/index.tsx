import { Card, CardBody, Heading, PrizeIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

import { Achievement } from 'state/types'
import AchievementsList from './AchievementsList'
import ClaimPointsCallout from './ClaimPointsCallout'

const Achievements: React.FC<{
  achievements: Achievement[]
  isLoading: boolean
  points?: number
  onSuccess?: () => void
}> = ({ achievements, isLoading, points = 0, onSuccess = null }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardBody>
        <Heading as="h4" scale="md" mb="16px">
          {t('Achievements')}
        </Heading>
        <ClaimPointsCallout onSuccess={onSuccess} />
      </CardBody>
    </Card>
  )
}

export default Achievements
