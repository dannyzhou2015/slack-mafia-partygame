import { NIGHT_ACTIVITY, LANG } from '../settings/gameSettings'
import JanitorStrings from '../strings/roles/janitor'
import miscStrings from '../strings/misc'
import Poll from '../Poll'
import { sleep } from '../utils'
import _ from 'lodash'

const str = new JanitorStrings(LANG)
    const misc = miscStrings[LANG]

    let janitor = {
        name: 'Janitor',
        affiliation: 'Mafia',
        category: 'Mafia Support',
        desc: {
            name: str.desc('name'),
            particle: str.desc('particle'),
            summary: str.desc('summary'),
            goal: str.desc('goal'),
            nightAbility: str.desc('nightAbility')
        },
        params: {
            isUnique: false,
            investigationCop: misc.investigation.mafia
        },

        activatePreNightAbility() {

        },

        activateNightAbility(player) {
            const chan = player.id
                const text = str.activateNightAbility()
                const choices = player.game.getPlayers({ except: player.name })
                let poll = new Poll(player.game, chan, text, choices)
                poll.start()
                sleep(NIGHT_ACTIVITY)
                .then(() => poll.end())
                .then(() => player.poll = poll)
                .then(() => player.visit())
        },

        resolveNightAbility(player) {
            return new Promise((resolve, reject) => {
                const resPoll = player.poll.getMaxVoted()
                let text, target
                if (resPoll.maxVote > 0) {
                    target = _.find(player.game.players, { name: resPoll.targets[0] })
                    if (target) {
                        target.isSanitized = true
                        // target.isDoused = false
                        // player.game.postMessage(target.id, str.resolveNightAbility('undoused'))
                        text = str.resolveNightAbility('sanitize', '<@'+target.id+'>')
                    } else {
                        text = str.resolveNightAbility('noSanitize')    
                    }
                } else {
                    text = str.resolveNightAbility('noSanitize')
                }
                console.log("resolving janitor night ability")
                console.log("target is ")
                console.log(target)
                console.log(text)
                if (target) {
                    player.game.postMessage(player.id, text)
                        .then(() => target.showLastWill(player.id))
                        .then(() => resolve(true))
                } else {
                    player.game.postMessage(player.id, text)
                        .then(() => resolve(true))
                }
                
            })
        },

        visit(player) {
            return new Promise((resolve, reject) => {
                const resPoll = player.poll.getMaxVoted()
                    if (resPoll.maxVote > 0) {
                        const target = _.find(player.game.players, { name: resPoll.targets[0] })
                            player.game.gameEmitter.emit('nightEvent', {
                                type: 'visit',
                                player: player.name,
                                target: target.name
                            })
                        player.addCrime(misc.crimes.trespassing)
                    }
                resolve(true)
            })
        }
    }

export default janitor
