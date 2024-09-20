<script lang="ts" setup>
import { useAuthStore } from "~/stores/auth-store";
// import { useNotificationsStore } from '../../stores/notifications'

const { push } = useRouter();
const authStore = useAuthStore();
//const notificationHub = useNotificationsStore()

async function logOut() {
    // await notificationHub.stopSignalR()
    await authStore.logout();
    push("/");
}

onMounted(async () => {
    await logOut();
});
</script>
