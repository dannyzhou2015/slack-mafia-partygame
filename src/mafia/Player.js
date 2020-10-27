import { LANG } from './settings/gameSettings'
import miscStrings from './strings/misc'
import _ from 'lodash'

const misc = miscStrings[LANG]

export default class Player {
    constructor(id, name, role, game) {
        this.id = id
            this.name = name
            this.role = role
            this.game = game
            this.isAlive = true
            this.isSanitized = false // janitor
            this.isDoused = false // arsonist
            this.roleBlocked = false // escort, consort
            this.protections = 0
            this.hasNightImmunity = false
            this.ignoreNightImmunity = false
            this.lastWill = ''
            this.crimes = []
            this.score = 0
            this.daysAlive = 0
            this.poll

    }

    activateNightAbility() {
        this.role.activateNightAbility(this)
    }

    getDisplayedName() {
        return '<@'+this.id+'>'
    }

    resolveNightAbility(events) {
        return new Promise((resolve, reject) => {
            if (this.role.immuneToRoleBlock) {
                this.role.resolveNightAbility(this, events)
                    .then((res) => {console.log("res1");console.log(res);resolve(res)})
            } else {
                if (this.roleBlocked) {
                    this.game.postMessage(this.id, misc.roleBlocked)
                        .then((res) => {console.log("res2");console.log(res);resolve(res)})
                } else {
                    this.role.resolveNightAbility(this, events)
                        .then((res) => {console.log("res3");console.log(res);resolve(res)})
                }
            }
        })
    }

    visit() {
        return new Promise((resolve, reject) => {
            this.role.visit(this)
                .then(() => resolve(true))
        })
    }

    cancelVisit() {
        _.last(this.game.gameState.cycles)
            .events = _.filter(_.last(this.game.gameState.cycles)
                    .events, e => {
                        return ((e.type != 'visit') || ((e.type == 'visit') && (e.player != this.name)))
                    })
    }

    addCrime(crime) {
        if (_.indexOf(this.crimes, crime) == -1) {
            this.crimes.push(crime)
        }
    }

    getCrimes() {
        if (this.crimes.length == 0) {
            return [misc.crimes.noCrime]
        } else {
            return this.crimes
        }
    }

    newLastWill(text) {
        this.lastWill = text
            this.showLastWill(this.id)
    }

    showLastWill(chan) {
        return new Promise((resolve, reject) => {
            console.log("lastwill1")
            let lastWill = this.lastWill.length > 0 ? this.lastWill : 'empty'
                let text = misc.lastWill('<@' + this.id + '>')
                text = '_' + text + '_:\n ```' + lastWill + '```'
                console.log("lastwill2")
                this.game.postMessage(chan, text)
                .then(() => resolve(true))
                console.log("lastwill3")
        })
    }

}
