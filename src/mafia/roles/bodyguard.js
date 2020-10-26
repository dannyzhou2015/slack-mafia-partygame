import { NIGHT_ACTIVITY, LANG } from '../settings/gameSettings'
import BodyguardStrings from '../strings/roles/bodyguard'
import miscStrings from '../strings/misc'
import Poll from '../Poll'
import { sleep } from '../utils'
import _ from 'lodash'

const str = new BodyguardStrings(LANG)
    const misc = miscStrings[LANG]

    let bodyguard = {
        name: 'Bodyguard',
        affiliation: 'Town',
        category: 'Town Supportive', // caveat solved
        desc: {
            name: str.desc('name'),
            particle: str.desc('particle'),
            summary: str.desc('summary'),
            goal: str.desc('goal'),
            nightAbility: str.desc('nightAbility')
        },
        params: {
            isUnique: false,
            investigationCop: misc.investigation.innocent
        },

        activatePreNightAbility(player, game) {

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

        resolveNightAbility(player, events) {
            return new Promise((resolve, reject) => {
                console.log("bodyguard 1")
                const resPoll = player.poll.getMaxVoted()
                    let text
                    if (resPoll.maxVote > 0) {
                        console.log("bodyguard 2")
                        const target = _.find(player.game.players, { name: resPoll.targets[0] })
                        const finalEvents = []
                        text = str.resolveNightAbility('protection', '<@'+target.id+'>')
                        console.log("bodyguard 3")
                        let b = true
                        console.log(events)
                        _.forEach(events, event => {
                                console.log("bodyguard 4")
                                if ((event.type == 'kill' && event.target == target.name && event.player != event.target)) {
                                    let killer = _.find(player.game.players, { name: event.player })
                                        if ((_.indexOf(['Veteran', 'Bodyguard'], killer.role.name) == -1) && b) {
                                            //player.game.gameEmitter.emit('nightEvent', { type: 'kill', player: player.name, target: killer.name })
                                            finalEvents.push({ type: 'kill', killType:'bodyguard', player: player.name, target: killer.name })
                                                b = false
                                        } else {
                                            finalsEvents.push(event)
                                        }
                                } else {
                                    finalEvents.push(event)
                                }
                        })
                        console.log("bodyguard 5")
                        console.log(events)
                        console.log(finalEvents)    
                        player.game.postMessage(player.id, text)
                            .then(() => resolve(finalEvents))
                    } else {
                        console.log("bodyguard 6")
                        player.game.postMessage(player.id, str.resolveNightAbility('noProtection'))
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

                    }
                resolve(true)
            })
        }
    }

export default bodyguard
