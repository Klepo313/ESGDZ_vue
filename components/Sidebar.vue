<template>
    <div>
        <div class="sidebar">
            <span v-if="upitnik && upitnik[0]" class="sidebar-main router_span" @click="toggleExpanded_main">
                <font-awesome-icon icon="layer-group" size="lg" />
                <span class="sidebar-main-text">{{ upitnikInfoStore.getEzuNaziv }}</span>
            </span>
            <ul class="sidebar-list" v-if="expanded && upitnikData">
                <li class="sidebar-item" v-for="group in upitnikData" :key="group.id">
                    <span class="sidebar-sub router_span" @click="toggleExpanded(group.id); displayQuestions(group);"
                        :class="{ 'selected-group': selectedGroupId === group.id }">
                        <font-awesome-icon icon="bars-staggered" size="lg" />
                        <span class="sidebar-text">{{ group.name }}</span>
                        <font-awesome-icon v-if="group.children && group.children.length > 0" class="arrow arrow-sub"
                            :icon="isExpanded(group.id) ? 'chevron-down' : 'chevron-right'" />
                        <font-awesome-icon v-else class="arrow2" icon="circle-check"
                            v-if="answeredGroups[group.id] !== undefined && answeredGroups[group.id]" />
                    </span>
                    <ul class="sidebar-sub-list"
                        v-if="isExpanded(group.id) && group.children && group.children.length > 0">
                        <li class="sidebar-item" v-for="category in group.children" :key="category.id">
                            <span class="sidebar-sub router_span"
                                @click="toggleSubExpanded(category.id); displayQuestions(category);"
                                :class="{ 'selected-group': selectedGroupId === category.id }">
                                <font-awesome-icon icon="list" size="lg" />
                                <span class="sidebar-text">{{ category.name }}</span>
                                <font-awesome-icon v-if="category.children && category.children.length > 0"
                                    class="arrow arrow-sub"
                                    :icon="isSubExpanded(category.id) ? 'chevron-down' : 'chevron-right'" />
                                <font-awesome-icon v-else class="arrow2" icon="circle-check"
                                    v-if="answeredGroups[category.id] !== undefined && answeredGroups[category.id]" />
                            </span>
                            <ul class="sidebar-sub-list"
                                v-if="isSubExpanded(category.id) && category.children && category.children.length > 0">
                                <li class="sidebar-item" v-for="subcategory in category.children" :key="subcategory.id"
                                    @click="displayQuestions(subcategory)">
                                    <span class="sidebar-sub router_span"
                                        :class="{ 'selected-group': selectedGroupId === subcategory.id }">
                                        <font-awesome-icon icon="list-check" />
                                        <span class="sidebar-text">{{ subcategory.name }}</span>
                                        <font-awesome-icon
                                            v-if="!subcategory.children && answeredGroups[subcategory.id]"
                                            class="arrow2" icon="circle-check" />
                                    </span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>

            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useBreadcrumbStore } from '~/stores/breadcrumbStore';
import { useUpitnikInfoStore } from '#imports';
import { getAnsweredQuestionsForGroup } from '~/services/services';

const breadcrumbStore = useBreadcrumbStore();
const upitnikInfoStore = useUpitnikInfoStore();

const props = defineProps({
    evu_sif: String,
    upitnik: Object,
    upitnikData: {
        type: Array,
        default: () => []
    }
});

const p_ezu_id = computed(() => {
    const id = upitnikInfoStore.ezu_id;
    return isNaN(id) ? 0 : parseInt(id);
});

const answeredGroups = ref({});

const checkIfGroupIsAnswered = async (p_ezu_id, p_ess_id) => {
    const response = await getAnsweredQuestionsForGroup(p_ezu_id, parseInt(p_ess_id));
    const odgovoreno = response[0].uk_odgovoreno;
    const ukupno = response[0].uk_pitanja;
    return odgovoreno === ukupno;
};

const updateAnsweredGroups = async () => {
    const newAnsweredGroups = {};
    for (const group of props.upitnikData) {
        const isAnswered = await checkIfGroupIsAnswered(p_ezu_id.value, group.id);
        newAnsweredGroups[group.id] = isAnswered;
        for (const category of group.children) {
            const isAnswered = await checkIfGroupIsAnswered(p_ezu_id.value, category.id);
            newAnsweredGroups[category.id] = isAnswered;
            for (const subcategory of category.children) {
                const isAnswered = await checkIfGroupIsAnswered(p_ezu_id.value, subcategory.id);
                newAnsweredGroups[subcategory.id] = isAnswered;
            }
        }
    }
    answeredGroups.value = newAnsweredGroups;
};

watchEffect(() => {
    if (p_ezu_id.value && props.upitnikData.length > 0) {
        updateAnsweredGroups();
    }
});

const emit = defineEmits(['group-selected']);

const expanded = ref(true);
const expandedGroups = ref({});
const expandedSubGroups = ref({});
const selectedGroupId = ref(null);

const toggleExpanded_main = () => {
    const anyExpanded = Object.values(expandedGroups.value).some(val => val) || Object.values(expandedSubGroups.value).some(val => val);

    if (anyExpanded) {
        Object.keys(expandedGroups.value).forEach(id => {
            expandedGroups.value[id] = false;
        });
        Object.keys(expandedSubGroups.value).forEach(id => {
            expandedSubGroups.value[id] = false;
        });
    } else {
        props.upitnikData.forEach(group => {
            expandedGroups.value[group.id] = true;
            if (group.children && group.children.length > 0) {
                group.children.forEach(subgroup => {
                    expandedSubGroups.value[subgroup.id] = true;
                });
            }
        });
    }
};

const toggleExpanded = (id) => {
    expandedGroups.value[id] = !expandedGroups.value[id];
};

const toggleSubExpanded = (id) => {
    expandedSubGroups.value[id] = !expandedSubGroups.value[id];
};

const isExpanded = (id) => !!expandedGroups.value[id];
const isSubExpanded = (id) => !!expandedSubGroups.value[id];

const addToBreadcrumb = (group) => {
    breadcrumbStore.addToBreadcrumbPath(group);
};

const displayQuestions = (group) => {
    addToBreadcrumb(group);
    selectedGroupId.value = group.id;
    if (group.questions != 0 || !group.children || !group.children.length > 0) {
        emit('group-selected', group.id);
        navigateTo(`/#${group.id}`);
    }
}

const findGroupById = (groups, id) => {
    for (const group of groups) {
        if (parseInt(group.id) === id) {
            return group;
        }
        if (group.children && group.children.length > 0) {
            const found = findGroupById(group.children, id);
            if (found) {
                return found;
            }
        }
    }
    return null;
};

const handleHashChange = () => {
    const groupIdFromHash = parseInt(window.location.hash.substring(1));
    if (!isNaN(groupIdFromHash)) {
        const selectedGroup = findGroupById(props.upitnikData, groupIdFromHash);
        if (selectedGroup) {
            selectedGroupId.value = selectedGroup.id;
            expandToGroup(selectedGroup.id);
            displayQuestions(selectedGroup);
        } else {
            console.error(`Group with ID ${groupIdFromHash} not found.`);
        }
    }
};

const expandToGroup = (id) => {
    const expandParents = (groups) => {
        for (const group of groups) {
            if (group.id === id || (group.children && group.children.some(child => child.id === id))) {
                expandedGroups.value[group.id] = true;
            }
            if (group.children && group.children.length > 0) {
                expandParents(group.children);
            }
        }
    }
    expandParents(props.upitnikData);
};

watch(() => props.upitnikData, () => {
    handleHashChange();
}, { immediate: true });

onMounted(() => {
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    updateAnsweredGroups();
});

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', handleHashChange);
});
</script>


<style scoped>
* {
    transition: 0.3s ease-in-out;
}

/* Stil za osnovne stavke */
.sidebar-main {
    display: flex;
    align-items: center;
    padding: 10px 18px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 5px 5px 0px 0px;
    cursor: pointer;
    gap: 10px;
}

.sidebar-main:hover {
    background-color: var(--primary_hovered);
}

.sidebar-main-text {
    font-size: 16px;
    font-weight: 400;
}

/* Opći stil za liste i stavke */
.sidebar-list {
    font-size: 14px;
    list-style-type: none;
    padding: 5px 0px;
    /* margin: 10px 0; */
    border-radius: 0px 0px 5px 5px;
    background-color: #0b79bd13;
}

.sidebar-sub {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 10px 18px;
    border-radius: 5px;
    /* background-color: #0b79bd33; */
}

.sidebar-item {
    border-radius: 15px;
    cursor: pointer;
}

.sidebar-item+.sidebar-item {
    margin-top: 2px;
}

.sidebar-sub:hover {
    background-color: rgba(0, 0, 0, 0.116);
}

.sidebar-sub:hover .arrow-sub {
    opacity: 1;
}

.selected-group {
    background-color: #a8d1f7;
    cursor: default;
}

.selected-group:hover {
    background-color: #a8d1f7;
}

/* Stil za podliste */
.sidebar-sub-list {
    margin-top: 5px;
    list-style-type: none;
    padding-left: 18px;
}

/* Stil za strelice */
.arrow,
.arrow2 {
    position: absolute;
    right: 18px;
}

.arrow2 {
    color: green;
    opacity: 0.85;
}

.arrow-sub {
    opacity: 0.3;
}
</style>