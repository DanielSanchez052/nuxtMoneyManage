<script setup lang="ts">
import { ref, reactive } from "vue";
import TransactionsTable from "~/components/transactions/TransactionsTable.vue";
import EditTransactionForm from "~/components/transactions/EditTransactionForm.vue";
import type {
    Transaction,
    TransactionFilters,
    NewTransaction,
} from "~/types/transactions";
import { useModal, useToast } from "vuestic-ui";
import type { Source } from "~/types/sources";
import type { TypeProp, Pagination } from "~/types/api";

const { t } = useI18n();
const { $api } = useNuxtApp();

const transactionSelected = ref<Transaction | null>(null);
const doShowTransactionFormModal = ref(false);
const doShowMoreInfoModal = ref(false);
const filters = ref<TransactionFilters>({
    Type: null,
    Source: null,
    AccountId: null,
    TransactionDateRange: null,
});
const pagination = ref<Pagination>({ PageIndex: 1, PageSize: 10 });

const { data: transactions, status: transactionStatus } =
    $api.transaction.getTransactions(filters.value, pagination.value);

console.log(transactions.value);
console.log(transactionStatus);

const sources = ref<Source[]>([]);
const { data: types } = $api.transaction.getTransactionTypes();

const editTransaction = (transaction: Transaction) => {
    transactionSelected.value = transaction;
    doShowTransactionFormModal.value = true;
};

const createNewTransaction = () => {
    transactionSelected.value = null;
    doShowTransactionFormModal.value = true;
};

const showMoreInfo = (transaction: Transaction) => {
    transactionSelected.value = transaction;
    doShowMoreInfoModal.value = true;
};

const { init: notify } = useToast();

const onTransactionSaved = async (transaction: Transaction) => {
    doShowTransactionFormModal.value = false;
    if ("id" in transaction && transaction["id"] != "") {
        try {
            console.log("update");
            //await update(transaction);
        } catch (err) {
            notify({
                message: `${err}`,
                color: "danger",
            });
        }

        notify({
            message: "Transaction updated",
            color: "success",
        });
    } else {
        const newTransaction: NewTransaction = {
            accountId: transaction.accountId,
            ammount: transaction.ammount,
            sourceId: transaction.source.id,
            type: transaction.type.id,
            transactionDate: transaction.transactionDate,
            transactionExtendedProperties:
                transaction.transactionExtendedProperties,
        };
        try {
            console.log("add");
            // await add(newTransaction);
        } catch (err) {
            notify({
                message: `${err}`,
                color: "danger",
            });
        }

        notify({
            message: "Transaction created",
            color: "success",
        });
    }
};

const { confirm } = useModal();

const onSourceDeleted = async (project: Transaction) => {
    const response = await confirm({
        title: "Delete project",
        message: `Are you sure you want to delete project ?`,
        okText: "Delete",
        size: "small",
        maxWidth: "380px",
    });

    if (!response) {
        return;
    }
    console.log("remove");
    // await remove(project);
    notify({
        message: "Project deleted",
        color: "success",
    });
};

const editFormRef = ref();

const beforeEditFormModalClose = async (hide: () => unknown) => {
    if (editFormRef.value.isFormHasUnsavedChanges) {
        const agreed = await confirm({
            maxWidth: "380px",
            message:
                "Form has unsaved changes. Are you sure you want to close it?",
            size: "small",
        });
        if (agreed) {
            hide();
        }
    } else {
        hide();
    }
};

const beforeMoreInfoClose = async (hide: () => unknown) => {
    hide();
};

const defaultSource: Source = {
    id: "0",
    description: "Todos",
    name: t("transactions.type.all"),
    isActive: true,
};
const defaultType: TypeProp = {
    id: 0,
    name: "all",
    nameT: t("transactions.type.all") ?? "",
};
</script>

<template>
    <h1 class="page-title">{{ t("transactions.tittle") }}</h1>

    <VaCard>
        <VaCardContent>
            <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
                <div class="flex flex-col md:flex-row gap-2 justify-start">
                    <VaDateInput
                        v-model="filters.TransactionDateRange"
                        :placeholder="t('transactions.dateRangeFilter')"
                        mode="range"
                    />
                </div>
                <VaButton
                    icon="add"
                    size="medium"
                    :loading="transactionStatus == 'pending'"
                    @click="createNewTransaction"
                />
            </div>

            <!-- <TransactionsTable
                v-model:pagination="pagination"
                :transactions="{ }"
                :loading="transactionStatus == 'pending'"
                :filters="filters"
                @edit="editTransaction"
                @delete="onSourceDeleted"
                @moreInfo="showMoreInfo"
            /> -->
        </VaCardContent>

        <VaModal
            v-slot="{ cancel, ok }"
            v-model="doShowTransactionFormModal"
            size="large"
            mobile-fullscreen
            close-button
            stateful
            hide-default-actions
            :before-cancel="beforeEditFormModalClose"
        >
            <h1 v-if="transactionSelected === null" class="va-h5 mb-4">
                {{ t("transactions.add") }}
            </h1>
            <h1 v-else class="va-h5 mb-4">{{ t("transactions.edit") }}</h1>
            <EditTransactionForm
                ref="editFormRef"
                :transaction="transactionSelected"
                :save-button-label="
                    transactionSelected === null ? 'Add' : 'Save'
                "
                :action="transactionSelected === null ? 'add' : 'update'"
                :sources="sources"
                :types="types"
                @close="cancel"
                @save="
                    (transaction) => {
                        onTransactionSaved(transaction);
                        ok();
                    }
                "
            />
        </VaModal>
        <VaModal
            v-slot="{ cancel }"
            v-model="doShowMoreInfoModal"
            size="small"
            mobile-fullscreen
            close-button
            hide-default-actions
            :before-cancel="beforeMoreInfoClose"
        >
            <h1 class="va-h5 mb-4">{{ t("transactions.moreInfo") }}</h1>
            <div>
                <p
                    v-for="item in transactionSelected?.transactionExtendedProperties"
                    :key="item.key"
                    class="text-center dark:text-white"
                >
                    {{ item.displayName }} : {{ item.value }}
                </p>
            </div>
            <div
                class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2"
            >
                <VaButton preset="secondary" color="secondary" @click="cancel"
                    >Cancel</VaButton
                >
            </div>
        </VaModal>
    </VaCard>
</template>
