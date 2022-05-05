<template>
  <div>
    <l-map ref="map" style="height: 400px" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-feature-group ref="features">
        <l-polyline
          v-for="polyline in polylines"
          :key="polyline.id"
          :lat-lngs="polyline.latlngs"
          :color="getColor(polyline.level)"
        ></l-polyline>
      </l-feature-group>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LPolyline, LFeatureGroup } from 'vue2-leaflet'
import { segmentsService } from '@/services/segmentsService.js'

export default {
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    LFeatureGroup
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'TP3 app web',
      zoom: 12,
      center: [46.81, -71.22],
      polylines: []
    }
  },
  props: {
    trail: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    setNewFocus () {
      var nb = 0
      var x = 0
      var y = 0
      for (let i = 0; i < this.polylines.length; i++) {
        for (let j = 0; j < this.polylines[i].latlngs.length; j++) {
          nb++
          x += this.polylines[i].latlngs[j][0]
          y += this.polylines[i].latlngs[j][1]
        }
      }
      this.center = [x / nb, y / nb]
      // var group = new L.featureGroup([marker1, marker2, marker3])
      /* console.log(this.$refs.features.mapObject)
      console.log(this.$refs.features.mapObject.getBounds())
      this.$refs.map.mapObject.fitBounds(
        this.$refs.features.mapObject.getBounds()
      ) */
    },
    async loadPolyline () {
      var newLat = []
      var autoIncrementId = 0
      await this.trail.segments.forEach(async function (id) {
        const segments = await segmentsService.getSegmentById(id)
        autoIncrementId++
        const polyline = {
          id: autoIncrementId,
          latlngs: segments.coordinates,
          level: segments.level
        }
        newLat.push(polyline)
      })
      this.polylines = newLat
    },
    getColor (color) {
      if (color === 'Facile') {
        return 'green'
      } else if (color === 'Intermédiaire') {
        return 'blue'
      } else if (color === 'Difficile') {
        return 'orange'
      } else if (color === 'Très difficile') {
        return 'red'
      } else {
        return 'black'
      }
    }
  },
  watch: {
    trail: function () {
      this.loadPolyline()
    },
    polylines: function () {
      // if nécessaire pour la population longue du array
      // qui n'était pas fonctionnel avec un simple async/await
      if (this.polylines.length === this.trail.segments.length) {
        this.setNewFocus()
      }
    }
  }
}
</script>
