
<template>
    <div>
        <div class="sidebar">
            <span v-if="upitnik && upitnik[0]" class="sidebar-main router_span" @click="toggleExpanded_main"> <!--@click="toggleExpanded_main"-->
                <font-awesome-icon icon="layer-group" size="lg" />
                <span class="sidebar-main-text">{{ upitnikInfoStore.getEzuNaziv }}</span>
                <!-- <font-awesome-icon :icon="expanded ? 'chevron-down' : 'chevron-right'" class="arrow"  /> -->
            </span>
            <ul class="sidebar-list" v-if="expanded && upitnikData">
                <li class="sidebar-item" v-for="group in upitnikData" :key="group.id">
                    <span class="sidebar-sub router_span" @click="toggleExpanded(group.id); displayQuestions(group);">
                        <font-awesome-icon icon="bars-staggered" size="lg" />
                        <span class="sidebar-text">{{ group.name }}</span>
                        <font-awesome-icon v-if="group.children && group.children.length > 0" class="arrow arrow-sub" :icon="isExpanded(group.id) ? 'chevron-down' : 'chevron-right'"  />
                    </span>
                    <ul class="sidebar-sub-list" v-if="isExpanded(group.id) && group.children && group.children.length > 0" >
                        <li class="sidebar-item" v-for="category in group.children" :key="category.id">
                            <span class="sidebar-sub router_span" @click="toggleSubExpanded(category.id); displayQuestions(category);">
                                <font-awesome-icon icon="list" size="lg" />
                                <span class="sidebar-text">{{ category.name }}</span>
                                <font-awesome-icon v-if="category.children && category.children.length > 0" class="arrow arrow-sub" :icon="isSubExpanded(category.id) ? 'chevron-down' : 'chevron-right'"  />
                            </span>
                            <ul class="sidebar-sub-list" v-if="isSubExpanded(category.id) && category.children && category.children.length > 0">
                                <li class="sidebar-item" v-for="subcategory in category.children" :key="subcategory.id" @click="displayQuestions(subcategory)">
                                    <span class="sidebar-sub">
                                        <font-awesome-icon icon="list-check" />
                                        <span class="sidebar-text">{{ subcategory.name }}</span>
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
import { ref, defineProps, onBeforeMount, onMounted, defineEmits  } from 'vue'
import { useBreadcrumbStore } from '~/stores/breadcrumbStore';
import { useUpitnikInfoStore } from '#imports';

const breadcrumbStore = useBreadcrumbStore();
const upitnikInfoStore = useUpitnikInfoStore();

const props = defineProps({
    evu_sif: String,
    upitnik: Object,
    upitnikData: Object,
});

console.log(props.upitnik)

const emit = defineEmits(['group-selected']);

// const loadData = async () => {
//     upitnik.value = await getUpitnikData(props.evu_sif);
//     if (upitnik.value && upitnik.value.length > 0) {
//         upitnikData.value = upitnik.value[0].children;
//         upitnikInfoStore.setEzuNaziv(upitnik.value[0].name)
//     }
// }

// // Initial load
// await loadData();
// console.log(upitnikData.value);

// // Watch for changes in evu_sif and reload data
// watch(() => props.evu_sif, async (newVal, oldVal) => {
//     if (newVal !== oldVal) {
//         await loadData();
//     }
// });

// Reaktivna stanja koristeći Composition API


// Metode za preokretanje stanja

const expanded = ref(true);
const expandedGroups = ref({}); // Proširenje za grupe
const expandedSubGroups = ref({}); // Proširenje za podgrupe

// Prošri/sažmi sve
const toggleExpanded_main = () => {
    // Check if any group or sub-group is expanded
    const anyExpanded = Object.values(expandedGroups.value).some(val => val) || Object.values(expandedSubGroups.value).some(val => val);

    if (anyExpanded) {
        // Collapse all
        Object.keys(expandedGroups.value).forEach(id => {
            expandedGroups.value[id] = false;
        });
        Object.keys(expandedSubGroups.value).forEach(id => {
            expandedSubGroups.value[id] = false;
        });
    } else {
        // Expand all
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


// Metode za toggle
const toggleExpanded = (id) => {
    expandedGroups.value[id] = !expandedGroups.value[id]; // Proširenje ili sužavanje
};

const toggleSubExpanded = (id) => {
    expandedSubGroups.value[id] = !expandedSubGroups.value[id]; // Preokretanje proširenja
};

// Metode za provjeru stanja
const isExpanded = (id) => !!expandedGroups.value[id]; // Ako je ID true, prošireno je
const isSubExpanded = (id) => !!expandedSubGroups.value[id]; // Ako je ID true, prošireno je

const addToBreadcrumb = (group) => {
    breadcrumbStore.addToBreadcrumbPath(group);
};

const displayQuestions = (group) => {
    addToBreadcrumb(group);
    // Provjeri postoji li podniz possibleAnswers u grupi
    if (group.questions != 0 || !group.children || !group.children.length > 0) {
        // Emitiramo event s ID-jem grupe
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
    return null; // Ako nije pronađen odgovarajući ID
};

// // Metoda koja se poziva pri učitavanju komponente
// onMounted(() => {
//     const groupIdFromHash = parseInt(window.location.hash.substring(1)); // Dobiti ID iz URL-a

//     if (!isNaN(groupIdFromHash)) {
//         // Pronaći odgovarajuću grupu u upitnikData na temelju groupIdFromHash
//         const selectedGroup = props.upitnikData ? findGroupById(props.upitnikData, groupIdFromHash) : null;

//         console.log(selectedGroup);

//         if (selectedGroup) {
//             // Postaviti odabranu grupu
//             props.selectedGroupId = selectedGroup.id;

//             // Opcionalno: Prikazati pitanja za odabranu grupu
//             displayQuestions(selectedGroup);
//         } else {
//             console.error(`Group with ID ${groupIdFromHash} not found.`);
//         }
//     }
// });

const handleHashChange = () => {
    const groupIdFromHash = parseInt(window.location.hash.substring(1));
    if (!isNaN(groupIdFromHash)) {
        const selectedGroup = findGroupById(props.upitnikData, groupIdFromHash);
        if (selectedGroup) {
            props.selectedGroupId = selectedGroup.id;
            displayQuestions(selectedGroup);
        } else {
            console.error(`Group with ID ${groupIdFromHash} not found.`);
        }
    }
};

onMounted(() => {
    handleHashChange(); // Pozivamo funkciju prilikom montiranja komponente da bismo odmah reagirali na trenutni hash
    window.addEventListener('hashchange', handleHashChange); // Dodajemo event listener za promjenu hash-a
});

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', handleHashChange); // Uklanjamo event listener prilikom unmountanja komponente da bismo izbjegli memory leak
});

</script>
  
<style scoped>
*{
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
}

.sidebar-item {
    border-radius: 15px;
    cursor: pointer;
}

.sidebar-item + .sidebar-item {
    margin-top: 2px;
}

.sidebar-sub:hover {
    background-color: rgba(0, 0, 0, 0.116);
    border-radius: 5px;
}

.sidebar-sub:hover .arrow-sub{
    opacity: 1;
}

/* Stil za podliste */
.sidebar-sub-list {
    margin-top: 5px;
    list-style-type: none;
    padding-left: 18px;
}

/* Stil za strelice */
.arrow {
    position: absolute;
    right: 18px;
}

.arrow-sub {
    opacity: 0.3;
}
</style>
  