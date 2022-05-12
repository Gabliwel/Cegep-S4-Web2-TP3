<template>
  <div>
    <p v-if="isLoggedIn && onError === false">Connecter en tant que {{ this.name }}</p>
    <select class="custom-select" :disabled="hasServiceError" v-model="selectedPark">
      <option v-for="park in parks" :value="park" :key="park.id">{{ park.name }}</option>
    </select>
    <select
      class="custom-select"
      :disabled="hasServiceError || selectedPark === null"
      v-model="selectedTrail"
      style="margin-top: 15px"
    >
      <option v-for="trail in trails" :value="trail" :key="trail.id">{{ trail.name }}</option>
    </select>
    <b-container fluid v-if="selectedTrail !== null">
      <b-row style="margin-top: 15px">
        <b-col>
          <img
            v-if="likeLoading"
            src="@/assets/loadingWaiting.gif"
            alt="liked"
            style="height: 50px"
            @click="unlike()"
          />
          <img
            v-if="isLiked === true && likeLoading === false"
            src="@/assets/liked.png"
            alt="liked"
            style="height: 50px"
            @click="unlike()"
          />
          <img
            v-if="isLiked === false && likeLoading === false"
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
      hasServiceError: false,
      isLiked: false,
      likeLoading: false,
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
      this.hasServiceError = true
      this.makeToast('Impossible de charger les parks', 'Erreur Serveur')
    }
    if (this.isLoggedIn) {
      await this.$store.dispatch('profile/getProfile')
      if (this.onError) {
        this.makeToast('Erreur du chargement du profile', 'Erreur Serveur')
      }
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
  computed: {
    isLoggedIn () {
      return this.$store.getters['authentication/isLoggedIn']
    },
    onError () {
      return this.$store.state.profile.onError
    },
    name () {
      return this.$store.state.profile.name
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
        this.hasServiceError = true
        this.makeToast('Impossible de charger les sentiers pour le park choisi', 'Erreur Serveur')
      }
    },
    async getLike () {
      await this.updateLikes()
      if (this.isLoggedIn && !this.onError) {
        this.isLiked = await this.$store.dispatch('profile/hasLiked', this.likes)
      }
    },
    async like () {
      this.likeLoading = true
      if (this.isLoggedIn) {
        try {
          await this.$store.dispatch('profile/likeTrail', this.selectedTrail.id)
          this.isLiked = true
        } catch (e) {
          this.makeToast('Impossible de like pour le moment', 'Erreur Serveur')
        }
        this.updateLikes()
      } else {
        this.makeToast('Veuillez vous connecter faire cette action', 'Action Impossible')
      }
      this.likeLoading = false
    },
    async unlike () {
      this.likeLoading = true
      if (this.isLoggedIn) {
        try {
          await this.$store.dispatch('profile/dislikeTrail', this.likes)
          this.isLiked = false
        } catch (e) {
          this.makeToast('Impossible de retirer le like pour le moment', 'Erreur Serveur')
        }
        await this.updateLikes()
      } else {
        this.makeToast('Veuillez vous connecter faire cette action', 'Action Impossible')
      }
      this.likeLoading = false
    },
    async updateLikes () {
      try {
        this.likes = await trailsService.getNbLikesByTrailId(
          this.selectedTrail.id
        )
      } catch (error) {
        this.likes = []
        this.isLiked = false
        this.makeToast('Impossible de charger le nombre de like du sentier', 'Erreur Serveur')
      }
    },
    makeToast (msg, title) {
      this.$bvToast.toast(msg, {
        title: title,
        autoHideDelay: 5000,
        appendToast: true
      })
    }
  }
}
</script>
