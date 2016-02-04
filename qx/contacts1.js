// 因为一个接口路径写死了根目录, 已经重写了 base-static/js/contacts 模块
define("base-static/js/contacts1", ["base-modules/util2"], function(a, b, c) {
    var d = a("base-modules/util2"), e = FS.getAppStore("contactData"), f = function(a, b) {
        return a ? (b || (a.length = 0), _.each(a, function(c, d) {
            b(c, d) && a.splice(d, 1)
        }), a) : void 0
    }, g = _.extend({account: e.account,allCompanyDefaultString: e.allCompanyDefaultString || "全公司",boundEmployeeExmail: e.boundEmployeeExmail,enterpriseAccount: e.enterpriseAccount,exmailDomain: e.exmailDomain,functionPermissions: e.functionPermissions.slice(),inVipService: e.inVipService,isAdmin: e.isAdmin,isDemoAccount: e.isDemoAccount,isPhoneBound: e.isPhoneBound,mobile: e.mobile,modules: e.modules,productRole: FS.getAppStore("productRole"),productDeadline: FS.getAppStore("productDeadline"),productIsExpired: FS.getAppStore("productIsExpired"),uploadFileSizeLimit: e.uploadFileSizeLimit,version: e.version,showGuidePages: e.showGuidePages,webVersionDesc: e.webVersion}, e.currentMember), h = {employeeIds: [],employeeMap: {},employeeList: [],circleIds: [],circleMap: {},circleList: []}, i = {name: e.allCompanyDefaultString || "全公司",nickName: e.allCompanyDefaultString || "全公司",type: "g",memberCount: 0,isAsterisk: !1,id: "999999",spell: "quangongsi"};
    h.circleMap[i.id] = i, h.circleList.push(i), h.circleIds.push(i.id), g.profileImagePath = e.currentMember.profileImage, g.profileImage = d.getAvatarLink(e.currentMember.profileImage, 2);
    var j = 3, k = function(a) {
        j-- > 0 && setTimeout(a, 2e3)
    }, l = function(a) {
        _.each(a, function(a) {
            var b = {id: a.id,name: a.name,fullName: a.fullName || a.name,spell: (a.spell || "").toLowerCase(),gender: a.gender,profileImage: d.getAvatarLink(a.profileImage, 2),profileImagePath: a.profileImage || "",workingState: a.workingState,post: a.post,isStop: a.isStop,isAsterisk: a.isAsterisk,subEmployees: a.subEmployees,type: "p",circleIds: a.groupIDs};
            h.employeeMap[a.id] = b, h.employeeList.push(b), b.isStop || h.employeeIds.push(b.id), _.each(b.circleIds, function(b) {
                var c = h.circleMap[b];
                c && c.employeeIds.push(a.id)
            })
        })
    }, m = function(a) {
        a && a.length && (_.each(a, function(a) {
            var b = _.clone(a);
            b.type = "g", b.employeeIds = [], b.spell = (a.spell || "").toLowerCase(), h.circleMap[a.id] = b, h.circleList.push(b), h.circleIds.push(b.id)
        }), i.memberCount = a.length)
    }, n = function() {
        d.api({url: FS_BASEPATH + "/XV/Home/GetContactsData",success: function(a) {
                a.value;
                a.success && a.data ? (m(a.data.groups), l(a.data.members), o.snapshot("ready", !0), o.trigger("ready", !0)) : k(n)
            },error: function() {
                k(n)
            }}, {autoPrependPath: !1})
    }, o = {isReady: !1,ready: function(a, b) {
            if (a) {
                var c;
                b && b.wrapper && (c = $(b.wrapper).html('<div class="f-g-loading"></div>')), this.onceAlways("ready", function() {
                    o.isReady = !0, c && c.empty(), a && a()
                })
            }
        },getAllEmployees: function() {
            return _.map(h.employeeIds, function(a) {
                return _.clone(h.employeeMap[a])
            })
        },getNoCircleEmployees: function() {
            return _.filter(FS.contacts.getAllEmployees(), function(a) {
                return !a.circleIds || 0 == a.circleIds.length
            })
        },getAllEmployeeIds: function() {
            return _.clone(h.employeeIds)
        },getCurrentEmployee: function() {
            return _.clone(g)
        },getEmployeeById: function(a) {
            return _.clone(h.employeeMap[a])
        },getEmployeesByIds: function(a) {
            return _.map(a, function(a) {
                return _.clone(h.employeeMap[a])
            })
        },setEmployeeById: function(a, b) {
            if (a && b && _.isObject(b) && h.employeeMap[a]) {
                var c = h.employeeMap[a];
                b.circleIds && (_.each(c.circleIds, function(b) {
                    var c = h.circleMap[b];
                    c && f(c.employeeIds, function(b) {
                        return b == a
                    })
                }), _.each(b.circleIds, function(b) {
                    var c = h.circleMap[b];
                    c && (c.employeeIds.push(a), c.employeeIds.push(h.circleMap[a]))
                }), b.isStop === !1 && f(h.employeeIds, function(b) {
                    return b == a
                }), b.isStop === !0 && c.isStop === !1 && h.employeeIds.push(a)), _.extend(c, b)
            }
        },getEmployeeByName: function(a) {
            return _.find(h.employeeList, function(b) {
                return b.name == a
            })
        },getEmployeesByName: function(a) {
            return _.filter(h.employeeList, function(b) {
                return b.name == a
            })
        },getEmployeesByCircleId: function(a) {
            var b = h.circleMap[a];
            return b ? this.getEmployeesByIds(b.employeeIds) : []
        },getCircleById: function(a) {
            return _.clone(h.circleMap[a])
        },getCirclesByIds: function(a) {
            return _.map(a, function(a) {
                return _.clone(h.circleMap[a])
            })
        },getAllCircles: function() {
            return _.map(h.circleIds, function(a) {
                return _.clone(h.circleMap[a])
            })
        },getAllCircleIds: function() {
            return _.clone(h.circleIds)
        },getCircleByName: function(a) {
            return _.find(h.circleList, function(b) {
                return b.name == a
            })
        },getCirclesByName: function(a) {
            return _.filter(h.circleList, function(b) {
                return b.name == a
            })
        },getCirclesByEmployeeId: function(a) {
            var b = this.getEmployeeById(a);
            return b ? this.getCirclesByIds(b.circleIds) : []
        },getCirclesOfCurrentEmployee: function() {
            return this.getCirclesByIds(g.circleIds)
        },setCircleById: function(a, b) {
            a && b && _.isObject(b) && h.circleMap[a] && _.extend(h.circleMap[a], b)
        },getCompanyInfo: function() {
            return _.clone(i)
        }};
    _.extend(o, FS.Events), _.extend(FS, {contacts: o}), n()
});