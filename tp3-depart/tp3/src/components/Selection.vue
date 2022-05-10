<template>
  <div>
    <select class="custom-select" :disabled="hasError" v-model="selectedPark">
      <option v-for="park in parks" :value="park" :key="park.id">{{
        park.name
      }}</option>
    </select>
    <select
      class="custom-select"
      :disabled="hasError || selectedPark === null"
      v-model="selectedTrail"
      style="margin-top: 15px"
    >
      <option v-for="trail in trails" :value="trail" :key="trail.id">{{
        trail.name
      }}</option>
    </select>
    <b-container fluid v-if="selectedTrail !== null">
      <b-row style="margin-top: 15px">
        <b-col>
          <img
            v-if="isLiked === true"
            src="@/assets/liked.png"
            alt="liked"
            style="height: 50px"
            @click="unlike()"
          />
          <img
            v-if="isLiked === false"
            src="@/assets/notLiked.png"
            alt="notLiked"
            style="height: 50px"
            @click="like()"
          />
        </b-col>
        <b-col>
          <p>{{ this.selectedTrail.name }}</p>
        </b-col>
      </b-row>
      <b-row style="margin-top: 15px">
        <b-col>
          <p>{{ this.likes.length }}</p>
        </b-col>
        <b-col>
          <p>Parc: {{ this.selectedTrail.park }}</p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { parksService } from '@/services/parksService.js'
import { trailsService } from '@/services/trailsService.js'

export default {
  data () {
    return {
      parks: [],
      selectedPark: null,
      trails: [],
      selectedTrail: null,
      hasError: false,
      isLiked: false,
      likes: []
    }
  },
  async created () {
    try {
      const loadedParks = await parksService.getParks()
      this.parks = loadedParks.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
    } catch (error) {
      this.hasError = true
      console.log('error1')
    }
  },
  watch: {
    selectedPark: async function () {
      this.selectedTrail = null
      await this.loadTrails()
    },
    selectedTrail: async function () {
      if (this.selectedTrail !== null) {
        await this.getLike()
        this.$emit('changeSelectedTrail', this.selectedTrail)
      }
    }
  },
  methods: {
    async loadTrails () {
      try {
        const loadedTrails = await parksService.getTrailsByParkId(
          this.selectedPark.id
        )
        this.trails = loadedTrails.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        )
      } catch (error) {
        // this.hasError = true
        console.log('error2')
      }
    },
    async getLike () {
      try {
        this.likes = await trailsService.getNbLikesByTrailId(
          this.selectedTrail.id
        )
      } catch (error) {
        console.log('error')
      }
    },
    like () {
      this.isLiked = true
    },
    unlike () {
      this.isLiked = false
    }
  }
}
</script>
