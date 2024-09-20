<template>
    <VaLayout
        v-if="breakpoint.lgUp"
        class="h-screen bg-[var(--va-background-secondary)]"
    >
        <template #left>
            <NuxtLink
                class="bg-primary h-full flex items-center justify-center"
                style="width: 35vw"
                to="/"
                aria-label="Visit homepage"
            >
                <img
                    src="/MoneyManageLogo.webp"
                    class="mr-3 h-20"
                    alt="MoneyManage Logo"
                />
                <span
                    class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
                    >MoneyManage</span
                >
            </NuxtLink>
            <div
                class="z-40 absolute h-8 text-xs font-bold text-white right-5 bottom-5 mt-16 mr-2 flex gap-2"
            >
                <ThemeSwitcher :show-text="false" />
                <!-- <LanguageSwitcher :text="false" /> -->
            </div>
        </template>
        <template #content>
            <main
                class="h-full flex items-center justify-center mx-auto max-w-[420px]"
            >
                <slot />
            </main>
        </template>
    </VaLayout>

    <VaLayout v-else class="h-screen bg-[var(--va-background-secondary)]">
        <template #content>
            <div class="p-4">
                <main
                    class="h-full flex flex-row items-center justify-start mx-auto max-w-[420px]"
                >
                    <div class="flex flex-col items-center">
                        <NuxtLink
                            class="py-4"
                            to="/"
                            aria-label="Visit homepage"
                        >
                            <img
                                src="/MoneyManageLogo.webp"
                                class="mr-3 h-20"
                                alt="MoneyManage Logo"
                            />
                        </NuxtLink>
                        <div
                            class="z-40 absolute h-8 text-xs font-bold text-white right-5 bottom-5 mt-16 mr-2 flex gap-2"
                        >
                            <ThemeSwitcher :show-text="false" />
                            <!-- <LanguageSwitcher :text="false" /> -->
                        </div>
                        <slot />
                    </div>
                </main>
            </div>
        </template>
    </VaLayout>
</template>

<script lang="ts" setup>
import { useBreakpoint } from "vuestic-ui";
// import LanguageSwitcher from '~/components/settings/'
import ThemeSwitcher from "~/components/settings/theme-switcher/ThemeSwitcher.vue";

const breakpoint = useBreakpoint();
</script>
