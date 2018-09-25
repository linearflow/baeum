<template>
  <div class="white card max-height">
  </div>
</template>
<script>
export default {
  props: ['folder'],
  mounted() {
    document.title = `${this.folder.name} - enamel`
  },
}
</script>
<style scoped>
.folder-header {
  padding: 15px 24px 0;
  line-height: 21px;
  min-height: 40px;
}
.folder-statebar {  
  display: flex;
  height: 48px;
  position: relative;
  padding: 0 24px;
  border-bottom: solid 1px;
  border-color: rgba(0,0,0,.16);
}
.folder-name {
  padding: 0;
  margin: 5px 0;
  height: 32px;
  width: 100%;
}
.shared-with {
  padding-left: 7px;
}
.subfolder:hover {
  color: initial;
  cursor: default;
}
/*tooltip*/
.member-avatar {
  margin-right: 8px;
  cursor: pointer;
}
.member-avatar:hover .remove-button {
  visibility: visible;
}
.tooltip .tooltip-content {
  width: 278px;
  left: 50%; 
  margin-left: -139px;
}
.search-input {
  padding: 15px;
}
.contact-picker-item-list {
  padding-bottom: 24px;
  max-height: 295px;
  overflow: auto;
}
.group-field {
  box-sizing: border-box;
  padding: 15px;
}
.add-additional {
  display: flex;
  flex-direction: row;
}
.label {
  text-align: left;
}
</style>