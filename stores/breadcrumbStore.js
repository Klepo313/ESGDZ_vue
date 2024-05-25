
import { defineStore } from 'pinia';

export const useBreadcrumbStore = defineStore('breadcrumb', {
    state: () => ({
        breadcrumbPath: [],
    }),
    actions: {
        addToBreadcrumbPath(parent) {
            // Rekurzivno dodajte ID i naziv svih roditeljskih elemenata u breadcrumbPath
            const path = [];
            this.addParentToPath(parent, path);
            this.breadcrumbPath = path.reverse();
        },
        addParentToPath(parent, path) {
            if (parent) {
                path.push({ id: parent.id, name: parent.name });
                this.addParentToPath(parent.parent, path);
            }
        },
        clearBreadcrumbPath() {
            this.breadcrumbPath = [];
        },
    },
});
