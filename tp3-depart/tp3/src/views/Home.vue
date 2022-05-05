<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <b-container fluid>
      <b-row>
        <b-col style="margin-left: 50px">
          <Selection @changeSelectedTrail="onChangeSelectedTrail"/>
        </b-col>
        <b-col cols="7" style="margin-right: 50px">
          <Map v-bind:trail="selectedTrail"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Map from '@/components/Map.vue'
import Selection from '@/components/Selection.vue'

export default {
  components: {
    Map,
    Selection
  },
  methods: {
    onChangeSelectedTrail (newTrail) {
      this.selectedTrail = newTrail
    }
  },
  data () {
    return {
      selectedTrail: null
    }
  }
}
</script>
