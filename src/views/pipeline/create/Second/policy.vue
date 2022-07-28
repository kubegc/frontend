<template>
  <section class="policy-content">
    <div class="top">
      <el-form >
        <el-form-item label="选择参与成员" prop="members">
          <el-select
            placeholder="可搜寻选择用户"
            multiple
            clearable
            filterable
            collapse-tags
            size="small"
            :remote="hasAllUser"
            :remote-method="getUsers"
          >
            <!-- <template slot="prefix">
              <i class="el-icon-search prefix-icon"></i>
            </template>-->
            <el-option  label="所有用户" value="*"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="primary-title">配置协作规则</div>

    <div class="secondary-title">工作流</div>
    <el-form ref="workflowRef"  label-width="120px" label-position="left">
      <el-table  style="width: 100%;">
        <el-table-column label="基准工作流">
          <template slot-scope="{ row, $index }">
            <el-form-item class="base-item" :prop="`workflows[${$index}].name`" label-width="0px" required>
              <el-tooltip effect="dark" :content="row.name" placement="top" :popper-class="row.name ? '' : 'hidden-base-tooltip'">
                <el-select v-model="row.name" placeholder="请选择基准工作流" filterable size="small" :disabled="!row.add">
                  <el-option v-if="row.name" :label="row.name" :value="row.name"></el-option>
                  <el-option v-for="workflow in lastBaseWorkflows" :key="workflow" :label="workflow" :value="workflow"></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="配置">
          <template slot-scope="{ row }">
            <el-radio-group v-model="row.collaboration_type" @change="updateCollaborationType($event, 'workflow', row)">
              <el-tooltip effect="dark" content="成员基于此基准工作流新建一个工作流" placement="top">
                <el-radio label="new">独享</el-radio>
              </el-tooltip>
              <el-tooltip effect="dark" content="成员共享一个基准工作流" placement="top">
                <el-radio label="share">共享</el-radio>
              </el-tooltip>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-popover ref="workflowPopoverRef" placement="right" trigger="click">
              <div class="auth-list">
                <div class="title">
                  <el-checkbox
                    :indeterminate="isIndeterminate(row, 'workflow')"
                    :value="checkAll(row, 'workflow')"
                    @change="handleCheckAllChange($event, row, 'workflow')"
                  ></el-checkbox>所有权限
                </div>
                <el-checkbox-group v-model="row.verbs">
                  <el-checkbox
                    v-for="workflow in policy.workflow[row.collaboration_type === 'new' ? 'newPermi' : 'sharePermi']"
                    :key="workflow.action"
                    :label="workflow.action"
                    class="permission-item"
                  >
                    <i :class="[workflow.icon]"></i>
                    {{workflow.alias}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <el-button type="primary" slot="reference" size="mini" plain>权限</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="90px">
          <template slot-scope="{ $index }">
            <el-button type="primary" icon="el-icon-minus" size="mini" circle plain @click="deleteWorkflow($index)"></el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" circle plain @click="addWorkflow"></el-button>
          </template>
        </el-table-column>
        <div slot="empty">
          <el-button type="primary" icon="el-icon-plus" size="small" plain @click="addWorkflow"></el-button>
          <el-tag effect="dark">删除工作流将影响参与成员操作权限</el-tag>
        </div>
      </el-table>
    </el-form>

    <div class="secondary-title">环境</div>
    <el-form ref="environmentRef" :model="collaborationData" label-width="120px" label-position="left">
      <el-table :data="collaborationData" style="width: 100%;">
        <el-table-column label="基准环境">
          <template slot-scope="{ row, $index }">
            <el-form-item class="base-item" :prop="`products[${$index}].name`" label-width="0px" required>
              <el-tooltip effect="dark" :content="row.name" placement="top" :popper-class="row.name ? '' : 'hidden-base-tooltip'">
                <el-select v-model="row.name" placeholder="请选择基准环境" filterable size="small" :disabled="!row.add">
                  <el-option v-if="row.name" :label="row.name" :value="row.name"></el-option>
                  <el-option v-for="env in lastBaseEnvironments" :key="env" :label="env" :value="env"></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="配置">
          <template slot-scope="{ row }">
            <el-radio-group v-model="row.collaboration_type" @change="updateCollaborationType($event, 'environment', row)">
              <el-tooltip effect="dark" content="成员基于此基准环境新建一个环境" placement="top">
                <el-radio label="new">独享</el-radio>
              </el-tooltip>
              <el-tooltip effect="dark" content="成员共享一个基准环境" placement="top">
                <el-radio label="share">共享</el-radio>
              </el-tooltip>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作">
          <template slot-scope="{ row }">
            <el-popover ref="envPopoverRef" placement="right" trigger="click">
              <div class="auth-list">
                <div class="title">
                  <el-checkbox
                    :indeterminate="isIndeterminate(row, 'environment')"
                    :value="checkAll(row, 'environment')"
                    @change="handleCheckAllChange($event, row, 'environment')"
                  ></el-checkbox>
                  <i></i>
                  所有权限
                </div>
                <el-checkbox-group v-model="row.verbs">
                  <el-checkbox
                    v-for="environment in policy.environment[row.collaboration_type === 'new' ? 'newPermi' : 'sharePermi']"
                    :key="environment.action"
                    :label="environment.action"
                    class="permission-item"
                  >
                    <i :class="[environment.icon]"></i>
                    {{environment.alias}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <el-button type="primary" slot="reference" size="mini" plain style="margin-right: 10px;">权限</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="90px">
          <template slot-scope="{ $index }">
            <el-button type="primary" icon="el-icon-minus" size="mini" circle plain @click="deleteEnvironment($index)"></el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" circle plain @click="addEnvironment"></el-button>
          </template>
        </el-table-column>
        <div slot="empty">
          <el-button type="primary" icon="el-icon-plus" size="small" plain @click="addEnvironment"></el-button>
          <el-tag effect="dark">删除环境将影响参与成员操作权限</el-tag>
        </div>
      </el-table>
    </el-form>

<!--    <div class="recycle-resources">-->
<!--      <span class="primary-title recycle-title">-->
<!--        资源回收策略-->
<!--        <el-tooltip effect="dark" content="如果成员在一段时间内（配置的资源回收时间）没有访问项目，那么该成员的资源将会被回收，默认 0 天表示不回收。成员重新访问项目将会再次获得资源。" placement="top">-->
<!--          <i class="el-icon-question"></i>-->
<!--        </el-tooltip>-->
<!--      </span>-->
<!--      <el-input-number v-model="collaborationData.recycle_day" size="small" :min="0"></el-input-number>天-->
<!--    </div>-->

<!--    <div class="bottom">-->
<!--      <el-button type="primary" @click="handleCollaboration" :disabled="saveDisabled">保存</el-button>-->
<!--    </div>-->
<!--    <PolicyDialog-->
<!--      :changedInfo="changedInfo"-->
<!--      :visible.sync="visible"-->
<!--      :policyMap="policyMap"-->
<!--      :collaborationData="collaborationData"-->
<!--      :mode="mode"-->
<!--      :deleteMode="deleteMode"-->
<!--      :updateActiveName="updateActiveName"-->
<!--      @resetDisabled="resetDisabled"-->
<!--    ></PolicyDialog>-->
  </section>
</template>

<script>
// import { cloneDeep, uniqBy } from 'lodash'
// import PolicyDialog from './policyDialog.vue'
// import { queryRoleBindingsAPI, usersAPI } from '@api'
export default {
  props: {
    workflowList: Array,
    envList: Array,
    policy: Object,
    collaborationData: Object,
    deleteMode: Function,
    updateActiveName: Function
  },
  data () {
    this.rules = {
      members: {
        required: true,
        type: 'array',
        message: '请选择参与成员',
        trigger: ['blur', 'change']
      }
    }
    return {
      changedInfo: {},
      visible: false,
      mode: '',
      saveDisabled: true,
      currentUsers: [],
      userList: [],
      hasAllUser: false
    }
  },
  computed: {
    // projectName () {
    //   return this.$route.params.project_name
    // },
    // lastBaseWorkflows () {
    //   const usedWorkflows = this.collaborationData.workflows.map(
    //     workflow => workflow.name
    //   )
    //   return this.workflowList.filter(
    //     workflow => !usedWorkflows.includes(workflow)
    //   )
    // },
    // lastBaseEnvironments () {
    //   const usedEnvs = this.collaborationData.products.map(
    //     workflow => workflow.name
    //   )
    //   return this.envList.filter(env => !usedEnvs.includes(env))
    // },
    // policyMap () {
    //   const policy = this.policy
    //   const workflow = {}
    //   const environment = {}
    //   policy.workflow.newPermi.forEach(work => {
    //     workflow[work.action] = work.alias
    //   })
    //   policy.environment.newPermi.forEach(env => {
    //     environment[env.action] = env.alias
    //   })
    //   return {
    //     workflow,
    //     environment
    //   }
    // }
  },
  methods: {
    // getProjectUsers () {
    //   queryRoleBindingsAPI(this.projectName).then(res => {
    //     const userList = uniqBy(res, 'uid')
    //     const allId = userList.findIndex(user => user.uid === '*')
    //     if (allId !== -1) {
    //       this.hasAllUser = true
    //       userList.splice(allId, 1)
    //       this.getUsers()
    //     }
    //     this.currentUsers = userList
    //     this.userList = userList
    //   })
    // },
    // getUsers (search = '') {
    //   const projectName = this.projectName
    //   const payload = {
    //     name: search,
    //     page: 1,
    //     per_page: 100
    //   }
    //   usersAPI(payload, projectName).then(res => {
    //     res.users.forEach(user => {
    //       user.username = user.name
    //     })
    //     const users = uniqBy(res.users, 'uid')
    //     this.userList = uniqBy(this.userList.concat(users), 'uid')
    //     this.currentUsers = search ? users : this.userList
    //   })
    // },
    // updateCollaborationType (configType, resourceType, row) {
    //   if (row.add) {
    //     row.verbs = this.policy[resourceType][
    //       configType === 'new' ? 'newPermi' : 'sharePermi'
    //     ].map(data => data.action)
    //   } else {
    //     if (configType === 'share') {
    //       const deleteId = row.verbs.findIndex(verb =>
    //         verb.startsWith('delete_')
    //       )
    //       if (deleteId !== -1) {
    //         row.verbs.splice(deleteId, 1)
    //       }
    //       row.withDeletePermi = deleteId !== -1
    //     } else if (row.withDeletePermi) {
    //       const deletePermi = this.policy[resourceType].newPermi
    //         .map(data => data.action)
    //         .find(permi => permi.startsWith('delete_'))
    //       row.verbs.push(deletePermi)
    //     }
    //   }
    // },
    // isIndeterminate (row, type) {
    //   return (
    //     row.verbs.length > 0 &&
    //     row.verbs.length <
    //       this.policy[type][
    //         row.collaboration_type === 'new' ? 'newPermi' : 'sharePermi'
    //       ].length
    //   )
    // },
    // checkAll (row, type) {
    //   return (
    //     row.verbs.length ===
    //     this.policy[type][
    //       row.collaboration_type === 'new' ? 'newPermi' : 'sharePermi'
    //     ].length
    //   )
    // },
    // handleCheckAllChange (val, row, type) {
    //   row.verbs = val
    //     ? this.policy[type][
    //       row.collaboration_type === 'new' ? 'newPermi' : 'sharePermi'
    //     ].map(data => data.action)
    //     : []
    // },
    //
    // deleteWorkflow (index) {
    //   this.collaborationData.workflows.splice(index, 1)
    // },
    // addWorkflow () {
    //   this.validate('workflow').then(res => {
    //     this.collaborationData.workflows.push({
    //       name: '',
    //       collaboration_type: 'share',
    //       verbs: this.policy.workflow.sharePermi.map(data => data.action),
    //       add: true
    //     })
    //   })
    // },
    // deleteEnvironment (index) {
    //   this.collaborationData.products.splice(index, 1)
    // },
    // addEnvironment () {
    //   this.validate('environment').then(res => {
    //     this.collaborationData.products.push({
    //       name: '',
    //       collaboration_type: 'share',
    //       verbs: this.policy.environment.sharePermi.map(data => data.action),
    //       add: true
    //     })
    //   })
    // },
    // handleCollaboration () {
    //   if (!this.collaborationData.name) {
    //     this.$message({
    //       type: 'error',
    //       message: '请输入协作模式的名称!'
    //     })
    //     return
    //   }
    //   this.validate().then(() => {
    //     const data = this.collaborationData
    //     if (!data.workflows.length && !data.products.length) {
    //       this.$message({
    //         type: 'info',
    //         message: '请选择将要赋予用户的权限!'
    //       })
    //       return
    //     }
    //     this.checkDifferent(data, data.initCollaboration)
    //   })
    // },
    // validate (type = '') {
    //   let valid = []
    //   if (!type) {
    //     valid = [
    //       this.$refs.roleRef.validate(),
    //       this.$refs.workflowRef.validate(),
    //       this.$refs.environmentRef.validate()
    //     ]
    //     return Promise.all(valid)
    //   } else {
    //     return this.$refs[`${type}Ref`].validate()
    //   }
    // },
    // clearValidate () {
    //   this.$nextTick(() => {
    //     this.$refs.roleRef.clearValidate()
    //     this.$refs.workflowRef.clearValidate()
    //     this.$refs.environmentRef.clearValidate()
    //   })
    // },
    // checkDifferent (current, initial) {
    //   this.changedInfo = {}
    //   let changedInfo = {} //  added: {}, deleted: {}, updated: {}
    //
    //   const isAllMemberCurr = current ? current.members.includes('*') : false
    //   const isAllMemberInit = initial ? initial.members.includes('*') : false
    //
    //   if (!initial) {
    //     this.changedInfo = {
    //       added: {
    //         members: isAllMemberCurr
    //           ? ['所有用户']
    //           : this.transformUidToName(current.members),
    //         workflows: cloneDeep(current.workflows),
    //         products: cloneDeep(current.products)
    //       }
    //     }
    //     this.mode = 'added'
    //   } else if (!current) {
    //     this.changedInfo = {
    //       deleted: {
    //         members: isAllMemberInit
    //           ? ['所有用户']
    //           : this.transformUidToName(initial.members),
    //         workflows: cloneDeep(initial.workflows),
    //         products: cloneDeep(initial.products)
    //       }
    //     }
    //     this.mode = 'deleted'
    //   } else {
    //     // different user
    //     if (isAllMemberCurr && isAllMemberInit) {
    //       changedInfo = {
    //         updated: {
    //           members: ['所有用户']
    //         }
    //       }
    //     } else if (isAllMemberCurr) {
    //       changedInfo = {
    //         added: {
    //           members: ['所有用户']
    //         },
    //         updated: {
    //           members: []
    //         }
    //       }
    //     } else if (isAllMemberInit) {
    //       changedInfo = {
    //         deleted: {
    //           members: ['所有用户']
    //         },
    //         updated: {
    //           members: []
    //         }
    //       }
    //     } else {
    //       const members = this.getArraySet(initial.members, current.members)
    //       if (members.left.length) {
    //         changedInfo.deleted = {}
    //         changedInfo.deleted.members = this.transformUidToName(members.left)
    //       }
    //       if (members.right.length) {
    //         changedInfo.added = {}
    //         changedInfo.added.members = this.transformUidToName(members.right)
    //       }
    //       changedInfo = {
    //         ...changedInfo,
    //         updated: {
    //           members: this.transformUidToName(members.intersection)
    //         }
    //       }
    //     }
    //     // different workflow and product
    //     if (changedInfo.added) {
    //       changedInfo.added.workflows = cloneDeep(current.workflows)
    //       changedInfo.added.products = cloneDeep(current.products)
    //     }
    //     if (changedInfo.deleted) {
    //       changedInfo.deleted.workflows = cloneDeep(initial.workflows)
    //       changedInfo.deleted.products = cloneDeep(initial.products)
    //     }
    //     if (changedInfo.updated) {
    //       const workflows = this.getArraySet(
    //         initial.workflows,
    //         current.workflows,
    //         'name'
    //       )
    //       const products = this.getArraySet(
    //         initial.products,
    //         current.products,
    //         'name'
    //       )
    //       if (workflows.length || products.length) {
    //         changedInfo.updated.workflows = workflows.all
    //         changedInfo.updated.products = products.all
    //       } else {
    //         delete changedInfo.updated
    //       }
    //     }
    //     this.mode = 'updated'
    //     this.changedInfo = changedInfo
    //     if (initial.recycle_day !== current.recycle_day) {
    //       if (!this.changedInfo.updated) {
    //         this.changedInfo.updated = {}
    //       }
    //       this.changedInfo.updated.recycle_day = current.recycle_day
    //     }
    //   }
    //   if (
    //     Object.keys(this.changedInfo).length ||
    //     current.name !== current.initName
    //   ) {
    //     this.visible = true
    //   } else {
    //     this.$message.info('协作模式信息无变动！')
    //   }
    // },
    // transformUidToName (userIds) {
    //   if (!userIds.length) {
    //     return []
    //   }
    //   return this.userList
    //     .filter(user => userIds.includes(user.uid))
    //     .map(user => user.username)
    // },
    // getArraySet (arr1, arr2, key = '') {
    //   const a1 = cloneDeep(arr1)
    //   const a2 = cloneDeep(arr2)
    //   const res = {
    //     intersection: [],
    //     left: [],
    //     right: [],
    //     all: [],
    //     length: 0
    //   }
    //   a1.forEach(data => {
    //     const d = data[key] || data
    //     const id = a2.findIndex(data => (data[key] || data) === d)
    //     if (id !== -1) {
    //       const del = a2.splice(id, 1)[0]
    //       if (key) {
    //         let updated = false
    //         Object.keys(del).forEach(k => {
    //           if (
    //             (Array.isArray(del[k]) && del[k].length !== data[k].length) ||
    //             (!Array.isArray(del[k]) && del[k] !== data[k])
    //           ) {
    //             updated = true
    //           }
    //         })
    //         if (updated) {
    //           res.intersection.push({ ...del, type: 'updated' })
    //         }
    //       } else {
    //         res.intersection.push(del)
    //       }
    //     } else {
    //       res.left.push(key ? { ...data, type: 'deleted' } : data)
    //     }
    //   })
    //   res.right = key
    //     ? a2.map(a => {
    //       return { ...a, type: 'added' }
    //     })
    //     : a2
    //   res.length = res.intersection.length + res.left.length + res.right.length
    //   res.all = [].concat(res.intersection, res.left, res.right)
    //   return res
    // },
    // resetDisabled () {
    //   this.$nextTick(() => {
    //     this.saveDisabled = true
    //   })
    // }
  },
  watch: {
    // collaborationData: {
    //   handler (nVal, oVal) {
    //     if (nVal !== oVal) {
    //       oVal.saveDisabled = this.saveDisabled
    //       this.saveDisabled = nVal.saveDisabled !== false
    //     } else {
    //       this.saveDisabled = false
    //     }
    //   },
    //   deep: true
    // }
  },
  created () {
    // this.getProjectUsers()
  },
  components: {
    // PolicyDialog
  }
}
</script>

<style lang="less" scoped>
.policy-content {
  min-width: 600px;
  padding: 10px;
  color: #888;
  font-size: 16px;
  line-height: 22px;

  .primary-title,
  .secondary-title {
    margin: 24px 0 14px;
    font-weight: 300;
    font-size: 14px;
    line-height: 24px;
  }

  .primary-title {
    color: #000;
  }

  .secondary-title {
    color: #888;
  }

  .top {
    /deep/.el-select {
      width: calc(~'100% - 110px');
    }

    .prefix-icon {
      width: 30px;
      line-height: 30px;
    }
  }

  /deep/.el-form {
    .base-item {
      margin-bottom: 0;
    }
  }

  /deep/.el-table {
    .el-table__empty-block {
      text-align: left;

      .el-table__empty-text {
        width: 100%;

        .el-button {
          margin-right: 10px;
        }
      }
    }
  }

  .recycle-resources {
    .recycle-title {
      display: inline-block;
      width: 120px;
    }
  }

  .bottom {
    margin: 26px 0 16px;
  }

  .icon {
    font-size: 14px;
  }
}

.option-icon {
  margin-right: 3px;
}

.auth-list {
  margin: 0 10px;

  .title {
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e4e7ed;

    .el-checkbox {
      margin-right: 5px;
    }
  }

  .content {
    .tooltip {
      margin-top: 15px;
      color: #bcbec2;
    }
  }

  .el-checkbox-group {
    .el-checkbox {
      margin-right: 0;
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 2px;
      }
    }
  }

  .permission-item {
    display: block;
  }
}

.env-link {
  display: inline-block;
  width: 100%;
  height: calc(~'100% - 1px');
  color: #606266;
  border-bottom: 1px solid #d2d7dc;
}
</style>

<style lang="less">
.hidden-base-tooltip {
  display: none;
}
</style>
