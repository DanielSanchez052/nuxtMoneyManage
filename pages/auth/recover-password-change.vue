<template>
    <VaForm ref="passwordForm" @submit.prevent="submit">
        <h1 class="font-semibold text-4xl mb-4">change your password</h1>
        <VaInput
            v-model="formData.email"
            label="Email"
            class="mb-4"
            type="email"
            disabled
        />
        <VaValue v-slot="isPasswordVisible" :default-value="false">
            <VaInput
                ref="password1"
                v-model="formData.password"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                class="mb-4"
                label="Password"
                messages="Password should be 8+ characters: letters, numbers, and special characters."
                @clickAppendInner.stop="
                    isPasswordVisible.value = !isPasswordVisible.value
                "
            >
                <template #appendInner>
                    <VaIcon
                        :name="
                            isPasswordVisible.value
                                ? 'mso-visibility_off'
                                : 'mso-visibility'
                        "
                        class="cursor-pointer"
                        color="secondary"
                    />
                </template>
            </VaInput>
            <VaInput
                ref="password2"
                v-model="formData.repeatPassword"
                :rules="[
                    (v) => !!v || 'Repeat Password field is required',
                    (v) => v === formData.password || 'Passwords don\'t match',
                ]"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                class="mb-4"
                label="Repeat Password"
                @clickAppendInner.stop="
                    isPasswordVisible.value = !isPasswordVisible.value
                "
            >
                <template #appendInner>
                    <VaIcon
                        :name="
                            isPasswordVisible.value
                                ? 'mso-visibility_off'
                                : 'mso-visibility'
                        "
                        class="cursor-pointer"
                        color="secondary"
                    />
                </template>
            </VaInput>
        </VaValue>
        <div v-show="isError" class="w-full mb-6">
            <p
                v-for="errorM in messages"
                :key="errorM"
                class="mt-2 text-sm text-red-600 dark:text-red-500"
            >
                {{ errorM }}
            </p>
        </div>
        <VaButton class="w-full mb-2" :loading="isLoading" @click="submit"
            >Change password</VaButton
        >
    </VaForm>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { useForm, useToast } from "vuestic-ui";
import type { RecoverPassword } from "~/types/auth";
import type { ApiResponseError } from "~/types/api.js";

definePageMeta({
    layout: "auth-layout",
});

const { $api } = useNuxtApp();

const { validate } = useForm("passwordForm");
const router = useRouter();
const route = useRoute();
const { init } = useToast();

const formData = reactive<RecoverPassword>({
    email: "",
    password: "",
    repeatPassword: "",
});
const isLoading = ref(false);
const isError = ref(false);
const messages = ref<string[]>([]);

onMounted(() => {
    if (!route?.query || !route?.query?.Email || !route?.query?.Token) {
        router.push("/");
    }
    formData.email = route?.query?.Email?.toString() ?? "";
});

const submit = async () => {
    isLoading.value = true;
    if (validate()) {
        formData.email = route?.query?.Email?.toString() ?? "";
        formData.resetPasswordToken = route?.query?.Token?.toString() ?? "";

        const { data, error, status } = await $api.authentication.resetPassword(
            {
                email: formData.email,
                password: formData.password,
                resetPasswordToken: formData.resetPasswordToken,
            },
        );

        if (status.value === "error") {
            isError.value = true;

            const errors = error.value.data as ApiResponseError;
            messages.value.push(...errors.errors.map((e) => e.message));
        } else {
            isError.value = false;
            init({ message: "Password changed succesfully", color: "success" });
            router.push("/");
        }
        isLoading.value = false;
    }
};
</script>
