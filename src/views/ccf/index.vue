<template>
  <div style="float: right">
    <!-- <el-checkbox-group v-model="selected" size="mini" class="rankbox"> -->
    <!-- <el-checkbox-button>{{ ranking }}</el-checkbox-button> -->
    <el-checkbox-button v-for="(value, key) in ranking" :key="key">{{ value }}</el-checkbox-button>
    <!-- </el-checkbox-group> -->

<el-row class="zonedivider" />

    <el-table
      :show-header="false"
      style="width: 100%"
    >
      <el-table-column>
        <template slot-scope="scope">
          <div :class="{ 'conf-fin': scope.row.status === 'FIN' }">
            <el-row class="conf-title">
              <a :href="generateDBLP(scope.row.dblp)">{{ scope.row.title }}</a> {{ scope.row.year }}
              <i v-if="scope.row.isLike===true" class="el-icon-star-on" style="color: #FBCA04" />
              <i v-else class="el-icon-star-off" />
            </el-row>
            <el-row>{{ scope.row.date+' '+scope.row.place }}</el-row>
            <el-row class="conf-des">{{ scope.row.description }}</el-row>
            <el-row><el-tag size="mini" type="" effect="plain">CCF {{ scope.row.rank }}</el-tag> <span v-show="scope.row.comment" style="color: #409eff"><b>NOTE:</b> {{ scope.row.comment }}</span></el-row>
            <el-row style="padding-top: 5px"><span class="conf-sub">{{ scope.row.subname }}</span></el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <div :class="{ 'conf-fin': scope.row.status === 'FIN' }">
            <el-row class="conf-timer">
              <div v-if="scope.row.status === 'TBD'" style="color: black">TBD</div>
              <countdown v-else style="color: black" :time="scope.row.remain" :transform="transform">
                <template slot-scope="props">{{ props.days }} {{ props.hours }} {{ props.minutes }} {{ props.seconds }}</template>
              </countdown>
              <el-popover
                placement="right"
                trigger="click"
              >
                <el-row>
                  <img src="//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_3_2x.png#" srcset="//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_3_2x.png 2x ,//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_3_2x.png# 1x" alt="" aria-hidden="true" style="width:20px;height:20px;vertical-align: middle">
                  <span style="padding-left: 5px">
                    <a
                      :href="formatGoogleCalendar(scope.row)"
                      target="_blank"
                      rel="nofollow"
                    >Google Calendar</a>
                  </span>
                </el-row>
                <i slot="reference" class="el-icon-date icon" style="padding-left: 5px" />
              </el-popover>
            </el-row>
            <el-row>
              <div v-if="scope.row.status === 'TBD'">
                Deadline: <a href="https://github.com/ccfddl/ccf-deadlines/pulls">pull request to update</a>
              </div>
              <div v-else>
                Deadline: {{ scope.row.localDDL }} ({{ scope.row.originDDL }})
              </div>
            </el-row>
            <el-row>website: <a :href="scope.row.link">{{ scope.row.link }}</a> </el-row>
            <!--          <el-row>subscribe</el-row>-->
            <TimeLine v-if="scope.row.status === 'RUN'" :ddls="scope.row.ddls" />
          </div></template></el-table-column></el-table>
  </div>
</template>

<script>
import { ConfigMapValue } from '@/api/common'
import { mapGetters } from 'vuex'
import TimeLine from './TimeLine'
export default {
  name: 'Home',
  components: {
    TimeLine
  },
  data() {
    return {
      // olds
      publicPath: '/',
      checkAll: true,
      isIndeterminate: false,
      pageSize: 10,
      checkList: [],
      subList: [],
      allconfList: [],
      showList: [],
      showNumber: 0,
      typeMap: new Map(),
      timeZone: '',
      utcMap: new Map(),
      rankoptions: ['A', 'B', 'C'],
      typesList: [],
      rankList: [],
      cachedLikes: [],
      cachedRanks: [],
      input: '',

      //
      ranking: {},
      catalog: {},
      selected: ''
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.kind = this.$route.name // 该资源的名字
    ConfigMapValue(
      this.token,
      'ccf-ranking',
      this.ranking
      // eslint-disable-next-line no-sequences
    ),
    ConfigMapValue(
      this.token,
      'ccf-catalog',
      this.catalog
    )
  },
  mounted() {
    // this.loadCachedTypes()
    // this.loadCachedRanks()
    // this.loadCachedLikes()
    // this.loadUTCMap()
    // this.loadFile()
  },
  methods: {
    loadFile() {
      this.timeZone = tz
      this.$http.get(this.publicPath + 'conference/types.yml').then(response => {
        const doc = yaml.load(response.body)
        this.subList = doc
        for (let i = 0; i < this.subList.length; i++) {
          this.checkList.push(this.subList[i].sub)
          this.typesList.push(this.subList[i].sub)
          this.typeMap.set(this.subList[i].sub, this.subList[i].name)
        }
        this.loadCachedTypes()
        this.getAllConf()
      }, () => {
        alert('sorry your network is not stable!')
      })
    },
    getAllConf() {
      // get all conf
      this.$http.get(this.publicPath + 'conference/allconf.yml').then(response => {
        const allconf = yaml.load(response.body)
        // preprocess
        const doc = []
        const tmpTime = moment.tz(new Date(), tz)
        for (let i = 0; i < allconf.length; i++) {
          const curConf = allconf[i]
          for (let j = 0; j < curConf.confs.length; j++) {
            const curItem = curConf.confs[j]
            curItem.title = curConf.title
            curItem.description = curConf.description
            curItem.sub = curConf.sub
            curItem.rank = curConf.rank
            curItem.dblp = curConf.dblp
            const len = curItem.timeline.length
            curItem.deadline = curItem.timeline[len - 1].deadline
            curItem.abstract_deadline = curItem.timeline[len - 1].abstract_deadline
            curItem.comment = curItem.timeline[len - 1].comment
            curItem.ddls = []
            let flag = false
            for (let k = 0; k < len; k++) {
              const ddlTime = moment(curItem.timeline[k].deadline + this.utcMap.get(curItem.timezone))
              const diffTime = ddlTime.diff(tmpTime)
              curItem.ddls.push(curItem.timeline[k].deadline + this.utcMap.get(curItem.timezone))
              if (!flag && diffTime >= 0) {
                curItem.deadline = curItem.timeline[k].deadline
                curItem.abstract_deadline = curItem.timeline[k].abstract_deadline
                curItem.comment = curItem.timeline[k].comment
                flag = true
              }
            }
            doc.push(curItem)
          }
        }

        const curTime = moment.tz(new Date(), tz)
        for (let i = 0; i < doc.length; i++) {
          const curDoc = doc[i]
          curDoc.subname = this.typeMap.get(curDoc.sub)
          if (curDoc.deadline === 'TBD') {
            curDoc.remain = 0
            curDoc.status = 'TBD'
          } else {
            if (curDoc.timezone === 'AoE') {
              curDoc.timezone = 'UTC-12'
            }

            const ddlTime = moment(curDoc.deadline + this.utcMap.get(curDoc.timezone))
            curDoc.localDDL = ddlTime.tz(this.timeZone).format('ddd MMM Do YYYY HH:mm:ss z')
            curDoc.originDDL = curDoc.deadline + ' ' + curDoc.timezone
            if (curDoc.abstract_deadline) {
              const absTime = moment(curDoc.abstract_deadline + this.utcMap.get(curDoc.timezone))
              if (!curDoc.comment) {
                curDoc.comment = 'abstract deadline on ' + absTime.tz(this.timeZone).format('MMM D, YYYY') + '.'
              }
            }
            // alert(ddlTime.tz(this.timeZone).format('ddd MMM Do YYYY HH:mm:ss z'))
            const diffTime = ddlTime.diff(curTime)
            if (diffTime <= 0) {
              curDoc.remain = 0
              curDoc.status = 'FIN'
            } else {
              curDoc.remain = diffTime
              curDoc.status = 'RUN'
            }
            // check cachedLikes
            if (this.cachedLikes && this.cachedLikes.indexOf(curDoc.title + curDoc.id) >= 0) {
              curDoc.isLike = true
            } else {
              curDoc.isLike = false
            }
          }
          this.allconfList.push(curDoc)
        }
        this.showConf(this.typesList, this.rankList, this.input, 1)
      }, () => {
        alert('sorry your network is not stable!')
      })
    },
    showConf(types, rank, input, page) {
      let filterList = this.allconfList

      if (types != null) {
        filterList = filterList.filter(function(item) { return types.indexOf(item.sub.toUpperCase()) >= 0 })
      }

      if (rank != null && rank.length > 0) {
        filterList = filterList.filter(function(item) { return rank.indexOf(item.rank) >= 0 })
      }

      if (input != null && input.length > 0) {
        filterList = filterList.filter(function(item) { return item.id.toLowerCase().indexOf(input.toLowerCase()) >= 0 })
      }

      const runList = filterList.filter(function(item) { return item.status === 'RUN' })
      const tbdList = filterList.filter(function(item) { return item.status === 'TBD' })
      const finList = filterList.filter(function(item) { return item.status === 'FIN' })

      runList.sort((a, b) => (b.remain === a.remain ? 0 : a.remain < b.remain ? -1 : 1))
      finList.sort((a, b) => (b.year === a.year ? 0 : a.year > b.year ? -1 : 1))

      this.showList = []
      const allList = []
      const likesList = []
      allList.push.apply(allList, runList)
      allList.push.apply(allList, tbdList)
      allList.push.apply(allList, finList)

      for (let i = allList.length - 1; i >= 0; i--) {
        const curDoc = allList[i]
        if (curDoc.isLike === true) {
          likesList.push(curDoc)
          allList.splice(i, 1)
        }
      }
      likesList.reverse()
      likesList.push.apply(likesList, allList)
      this.showList = likesList
      this.showNumber = this.showList.length
      this.showList = this.showList.slice(this.pageSize * (page - 1), this.pageSize * page)
    },
    transform(props) {
      Object.entries(props).forEach(([key, value]) => {
        // Adds leading zero
        const digits = value < 10 ? `0${value}` : value
        // uses singular form when the value is less than 2
        const word = value < 2 ? key.replace(/s$/, '') : key
        if (word[0] === 'd') {
          props[key] = `${digits} ${word}`
        } else {
          props[key] = `${digits} ${word[0]}`
        }
      })
      return props
    },
    loadUTCMap() {
      for (let i = -12; i <= 12; i++) {
        if (i >= 0) {
          this.utcMap.set('UTC+' + i, '+' + (Array(2).join(0) + i).slice(-2) + '00')
        } else {
          this.utcMap.set('UTC' + i, '-' + (Array(2).join(0) + i * -1).slice(-2) + '00')
        }
      }
      this.utcMap.set('AoE', '-1200')
    },
    handleCheckedChange(types) {
      this.typesList = types
      const checkedCount = types.length
      this.checkAll = checkedCount === this.subList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.subList.length
      this.$ls.set('types', Array.from(this.typesList))
      this.showConf(this.typesList, this.rankList, this.input, 1)
    },
    handleInputChange() {
      this.showConf(this.typesList, this.rankList, this.input, 1)
    },
    handleRankChange(rank) {
      this.rankList = rank
      this.$ls.set('ranks', Array.from(this.rankList))
      this.showConf(this.typesList, this.rankList, this.input, 1)
    },
    handleCurrentChange(page) {
      this.showConf(this.typesList, this.rankList, this.input, page)
    },
    handleCheckAllChange() {
      this.typesList = (this.checkList.length === this.subList.length) ? [] : this.subList.map((obj) => { return obj.sub }).join(',').split(',')
      this.checkList = this.typesList
      this.isIndeterminate = false
      this.$ls.set('types', Array.from(this.typesList))
      this.showConf(this.typesList, this.rankList, this.input, 1)
    },
    handleClickIcon(record, judge) {
      if (judge === true) {
        record.isLike = false
        const index = this.cachedLikes.indexOf(record.title + record.id)
        if (index > -1) this.cachedLikes.splice(index, 1)
        this.$ls.set('likes', Array.from(new Set(this.cachedLikes)))
      } else {
        record.isLike = true
        this.cachedLikes.push(record.title + record.id)
        this.$ls.set('likes', Array.from(new Set(this.cachedLikes)))
      }
    },
    generateDBLP(name) {
      return 'https://dblp.uni-trier.de/db/conf/' + name
    },
    formatGoogleCalendar(row) {
      return 'https://www.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + row.title + '+' + row.year +
        '&dates=' + moment(row.deadline + this.utcMap.get(row.timezone)).toISOString().replace(/-|:|\.\d\d\d/g, '') + '/' + moment(row.deadline + this.utcMap.get(row.timezone)).toISOString().replace(/-|:|\.\d\d\d/g, '') +
        '&details=' + row.comment +
        '&location=Online' +
        '&ctz=' + this.timeZone +
        '&sf=true&output=xml'
    },
    _isMobile() {
      const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag
    },
    formatSubName(item) {
      if (this._isMobile()) {
        return item.sub
      } else {
        return item.name
      }
    },
    loadCachedTypes() {
      const tmpList = this.$ls.get('types')
      if (tmpList) {
        this.typesList = tmpList
        this.checkList = this.typesList
        const checkedCount = this.checkList.length
        this.checkAll = checkedCount === this.subList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.subList.length
      }
    },
    loadCachedLikes() {
      this.cachedLikes = this.$ls.get('likes')
      if (!this.cachedLikes) this.cachedLikes = []
    },
    loadCachedRanks() {
      this.cachedRanks = this.$ls.get('ranks')
      if (!this.cachedRanks) this.cachedRanks = []
      this.rankList = this.cachedRanks
    }
  }
}
</script>

      <style scoped>
        /*/deep/ .el-table tbody tr { pointer-events:; }*/
        /deep/ .el-input--mini .el-input__inner {
        height: 20px;
        line-height: 20px;
        }

        /deep/ .el-input--mini .el-input__icon {
        line-height: 20px;
        }

        /deep/ .el-checkbox__inner {
        height: 20px;
        width: 20px;
        }

        /deep/ .el-button {
        height: 20px;
        padding: 0px 5px;
        }

        /deep/ .el-checkbox-button--mini .el-checkbox-button__inner {
        padding: 3px 10px;
        }

        /deep/ .el-checkbox__inner::after {
        -webkit-box-sizing: content-box;
        box-sizing: content-box;
        content: "";
        border: 3px solid #FFF;
        border-left: 0;
        border-top: 0;
        height: 11px;
        left: 6px;
        position: absolute;
        top: 1px;
        -webkit-transform: rotate(45deg) scaleY(0);
        transform: rotate(45deg) scaleY(0);
        width: 4px;
        -webkit-transition: -webkit-transform .15s ease-in .05s;
        transition: -webkit-transform .15s ease-in .05s;
        transition: transform .15s ease-in .05s,-webkit-transform .15s ease-in .05s;
        -webkit-transform-origin: center;
        transform-origin: center;
        }

        /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
        height: 6px;
        top: 6px;
        }

        .icon:hover{
        color:rgb(64, 158, 255);
        }

        .rankbox {
        padding-top: 1px;
        }

        .boxes{
        width: 33%;
        margin-right: 0px;
        padding-top: 10px;
        }

        .timezone{
        padding-top: 15px;
        color: #666666;
        }

        .zonedivider{
        margin-top: 8px;
        border-bottom: 1px solid #ebeef5;
        }

        .conf-title {
        font-size: 20px;
        font-weight: 400;
        color: black;
        }

        a{
        text-decoration: none;
        border-bottom: 1px solid #ccc;
        color: inherit;
        }

        .conf-des {
        font-size: 13px;
        }

        .conf-sub {
        color: rgb(36, 101, 191);
        background: rgba(236, 240, 241, 0.7);
        font-size: 13px;
        padding: 3px 5px;
        cursor: pointer;
        font-weight: 400;
        }

        .conf-timer {
        font-size: 20px;
        font-weight: 400;
        }

        .conf-fin{
        opacity: 0.4;
        }
      </style>
    </el-table-column></div></template>
