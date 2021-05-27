<template>
  <div class="grey lighten-3">
    <component :is="dashboard"></component>
  </div>
</template>

<script>
import ProfDash from "../components/ProfDash.vue";
import AlunoDash from "../components/AlunoDash.vue";

export default {
  components: {
    ProfDash,
    AlunoDash,
  },
  data() {
    return {};
  },
  computed: {
    dashboard() {
      const type = this.$store.getters.getUserType;
      if (type === "aluno") {
        return "AlunoDash";
      }
      return "ProfDash";
    },
  },
};
</script>

<style></style>
