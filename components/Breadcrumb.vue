<template>
    <ol>
        <!-- Početni link -->
        <div class="link">
            <li>
                <nuxt-link to="/#" style="color: inherit;" @click="breadcrumber = []">
                    <font-awesome-icon icon="house" />
                </nuxt-link>
            </li>
            <span class="separator" v-if="breadcrumber.length > 0">/</span>
        </div>

        <!-- Ostali linkovi iz breadcrumba -->
        <div v-for="group in breadcrumber" :key="group.id" class="link">
            <li>{{ truncateName(group.name) }}</li>
            <span class="separator"
                v-if="breadcrumber.length > 0 && (group.questions == 0 || group.nodes != 0)">/</span>
        </div>
    </ol>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
    selectedGroupId: {
        type: [Number, String],
        default: null
    },
    upitnikData: {
        type: Array,
        required: true
    },
});

const route = useRoute()
const breadcrumber = ref([]);


function findPathById(array, targetId) {
    let path = [];

    function search(node, targetId, currentPath) {
        currentPath.push({
            id: node.id,
            name: node.name,
            questions: node.questions,
            nodes: node.nodes
        });

        if (node.id === targetId) {
            path = [...currentPath];
            return true;
        }

        if (node.children) {
            for (let child of node.children) {
                if (search(child, targetId, currentPath)) {
                    return true;
                }
            }
        }

        currentPath.pop();
        return false;
    }

    for (let item of array) {
        if (search(item, targetId, [])) {
            break;
        }
    }

    return path;
}

// Funkcija za skraćivanje naziva
function truncateName(name, maxLength = 30) {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
}

watch(() => props.selectedGroupId, (newId) => {
    if (newId !== null && newId !== undefined) {
        breadcrumber.value = findPathById(props.upitnikData, newId.toString());
    } else {
        breadcrumber.value = [];
    }
}, { immediate: true });

console.log(breadcrumber.value);

watch(() => route.fullPath, (newPath) => {
    if (newPath === '/') {
        breadcrumber.value = [];
    }
}, { immediate: true });

onMounted(() => {
    if (route.fullPath === '/') {
        breadcrumber.value = [];
    }
});

onMounted(() => {
    window.addEventListener('popstate', handlePopState);
});

onBeforeUnmount(() => {
    window.removeEventListener('popstate', handlePopState);
});

function handlePopState() {
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
        breadcrumber.value = [];
    } else {
        // Dobij trenutni ID iz putanje i ažuriraj breadcrumb
        const currentId = getCurrentIdFromPath(currentPath);
        if (currentId) {
            breadcrumber.value = findPathById(props.upitnikData, currentId);
        }
    }
}

function getCurrentIdFromPath(path) {
    // Provjerite je li putanja prazna ili jednaka '/' (početna stranica)
    if (path === '/' || path === '') {
        return null;
    }

    // Ako nije prazna, pokušajte izvući ID iz putanje
    // Na primjer, ako je putanja "/questions/123", izvlačimo ID 123
    // U suprotnom, vratite null
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    const groupIdFromPath = parseInt(lastPart);

    // Ako je groupIdFromPath NaN, vrati null
    if (isNaN(groupIdFromPath)) {
        return null;
    } else {
        return groupIdFromPath;
    }
}



</script>

<!-- <script setup>
import { defineProps, ref, watch, onMounted } from 'vue';

const props = defineProps({
    selectedGroupId: Number,
    upitnikData: Object,
});

const breadcrumber = ref([]);

const createBreadcrumber = (groups, id) => {
    for (const group of groups) {
        if (parseInt(group.id) === id) {
            const path = [group];
            let parent = group;
            // Dodaj roditelje sve dok ne dođemo do korijena
            while (parent.parent) {
                path.unshift(parent.parent);
                parent = parent.parent;
            }
            return path;
        }
        if (group.children && group.children.length > 0) {
            const found = createBreadcrumber(group.children, id);
            if (found) {
                return found;
            }
        }
    }
    return null; // Ako nije pronađen odgovarajući ID
};

// Funkcija koja se poziva prilikom promjene selectedGroupId
const updateBreadcrumber = () => {
    if (props.selectedGroupId) {
        breadcrumber.value = createBreadcrumber(props.upitnikData, props.selectedGroupId);
    }
};

// Pozivamo funkciju updateBreadcrumber kada se komponenta montira
onMounted(updateBreadcrumber);

// Watch hook koji prati promjene u selectedGroupId i poziva updateBreadcrumber
watch(() => props.selectedGroupId, () => {
    updateBreadcrumber();
});
</script> -->


<style scoped>
ol {
    list-style-type: none;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

li {
    text-align: center;
}

.link {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}
</style>
