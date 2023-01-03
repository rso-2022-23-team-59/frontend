<template>
    <ManageEntity
        :endpoint="endpoint"
        :metadata="metadata"
    >
    </ManageEntity>
</template>

<script>
import ManageEntity from '@/components/ManageEntity.vue';
import { BASE_URL_NOTIF } from '@/utils/constants';

export default {
    data() {
        return {
            endpoint: `${BASE_URL_NOTIF}/notifications`,
            metadata: {
                headers: ["Email", "Id", "Zadnja cena", "ID produkta", "Meja za obvestilo preko email"],
                title: "Obvestila",

            }
        };
    },

    components: { ManageEntity }
};
</script>