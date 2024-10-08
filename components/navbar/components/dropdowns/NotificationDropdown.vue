<template>
  <VaDropdown :offset="[13, 0]" class="notification-dropdown" stick-to-edges :close-on-content-click="false">
    <template #anchor>
      <VaButton preset="secondary" color="textPrimary">
        <VaBadge overlap>
          <template #text>{{ notifications.length > 10 ? '10+' : notifications.length }}</template>
          <VaIconNotification class="notification-dropdown__icon" />
        </VaBadge>
      </VaButton>
    </template>
    <VaDropdownContent class="h-full sm:max-w-[420px] sm:h-auto">
      <!-- <section class="sm:max-h-[320px] p-4 overflow-auto">
        <VaListItem class="text-base">
          <VaListItemSection icon class="mx-0 p-0">
            <VaIcon name="monetization_on" :color="statusColorMap[authStore.account?.status ?? 'Medium']" />
          </VaListItemSection>
          <VaListItemSection>
            {{ formatMoney(authStore.account?.ammountBalance ?? 0) }}
          </VaListItemSection>
          <VaListItemSection icon class="mx-1">
            {{ t(`account.status.${authStore.account?.status}`) }}
          </VaListItemSection>
        </VaListItem>
        <VaList class="space-y-1 mb-2">
          <template v-for="(item, index) in notificationsWithRelativeTime" :key="item.id">
            <VaListItem class="text-base">
              <VaListItemSection icon class="mx-0 p-0">
                <VaIcon :name="item.icon" color="secondary" />
              </VaListItemSection>
              <VaListItemSection>J
                {{ item.message }}
              </VaListItemSection>
              <VaListItemSection icon class="mx-1">
                {{ item.updateTimestamp }}
              </VaListItemSection>
            </VaListItem>
            <VaListSeparator v-if="item.separator && index !== notificationsWithRelativeTime.length - 1" class="mx-3" />
          </template>
        </VaList>

        <VaButton preset="primary" class="w-full" @click="displayAllNotifications = !displayAllNotifications"
          >{{ displayAllNotifications ? t('notifications.less') : t('notifications.all') }}
        </VaButton>
      </section> -->
    </VaDropdownContent>
  </VaDropdown>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VaIconNotification from '~/components/icons/VaIconNotification.vue'
// import { useAuthStore } from '../../../../stores/auth'
// import { formatMoney } from '../../../../services/utils'
import { type Dictionary } from 'lodash'

const { t, locale } = useI18n()
// const authStore = useAuthStore()

const baseNumberOfVisibleNotifications = 4
const rtf = new Intl.RelativeTimeFormat(locale.value, { style: 'short' })
const displayAllNotifications = ref(false)

interface INotification {
  message: string
  icon: string
  id: number
  separator?: boolean
  updateTimestamp: Date
}

const statusColorMap: Dictionary<string> = {
  Positive: 'success',
  Medium: 'primary',
  Negative: 'danger',
}

const notifications: INotification[] = [
  // {
  //   message: '4 pending requests',
  //   icon: 'favorite_outline',
  //   id: 1,
  //   separator: true,
  //   updateTimestamp: makeDateFromNow(-3 * 60 * 1000),
  // },
]
//.sort((a, b) => new Date(b.updateTimestamp).getTime() - new Date(a.updateTimestamp).getTime())

const TIME_NAMES = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
  year: 1000 * 60 * 60 * 24 * 365,
}

const getTimeName = (differenceTime: number) => {
  return Object.keys(TIME_NAMES).reduce(
    (acc, key) => (TIME_NAMES[key as keyof typeof TIME_NAMES] < differenceTime ? key : acc),
    'month',
  ) as keyof typeof TIME_NAMES
}

const notificationsWithRelativeTime = computed(() => {
  const list = displayAllNotifications.value ? notifications : notifications.slice(0, baseNumberOfVisibleNotifications)

  return list.map((item, index) => {
    const timeDifference = Math.round(new Date().getTime() - new Date(item.updateTimestamp).getTime())
    const timeName = getTimeName(timeDifference)

    let separator = false

    const nextItem = list[index + 1]
    if (nextItem) {
      const nextItemDifference = Math.round(new Date().getTime() - new Date(nextItem.updateTimestamp).getTime())
      const nextItemTimeName = getTimeName(nextItemDifference)

      if (timeName !== nextItemTimeName) {
        separator = true
      }
    }

    return {
      ...item,
      updateTimestamp: rtf.format(-1 * Math.round(timeDifference / TIME_NAMES[timeName]), timeName),
      separator,
    }
  })
})
</script>

<style lang="scss" scoped>
.notification-dropdown {
  cursor: pointer;

  .notification-dropdown__icon {
    position: relative;
    display: flex;
    align-items: center;
  }

  .va-dropdown__anchor {
    display: inline-block;
  }
}
</style>
