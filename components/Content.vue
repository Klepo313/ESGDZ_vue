<template>
    <div>
        <div class="h1-div">
            <h1>{{ evu_naziv }}</h1>
            <div class="h1-rctg"></div>
        </div>
        <div class="breadcrumber-div">
            <div class="link-div">
                <Breadcrumb :upitnikData="upitnikData" :selectedGroupId="selectedGroupId" />
            </div>
        </div>
        <div class="component-div">
            <h2>Pitanja</h2>
            <Questions :selectedGroupId="selectedGroupId"/> <!--  :ess_id="ezu_ess_id"-->
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    evu_naziv: String,
    ezu_ess_id: Number,
    upitnikData: Object,
    selectedGroupId: Number
});

</script>

<style scoped>
h2{
    margin-top: 10px;
}
.h1-div{
    display: inline-block;
    position: relative;
}
.h1-rctg{
    position: absolute;
    left: 10px;
    bottom: 0px;

    width: 100%;
    height: 12px;
    background-color: var(--primary-color);
    filter: opacity(30%);
}
.breadcrumber-div{
    margin-top: 10px;
    height: 66px;
    display: flex;
    align-items: center;

    background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
}
.link-div{
    padding: 6px 20px;
    border-left: 3px solid var(--primary-color);
}
.component-div {
    /* outline: 1px solid red; */
    /* min-height: 80vh; Visina skrolajućeg dijela (80% visine prozora) */
    margin-top: 10px;
    overflow-y: auto; /* Omogućuje skrolanje samo po vertikali */
    position: relative; /* Za pseudo-elemente */
}

</style>