import { NIGHT_ACTIVITY, LANG } from '../settings/gameSettings'
import LookoutStrings from '../strings/roles/lookout'
import miscStrings from '../strings/misc'
import Poll from '../Poll'
import { sleep } from '../utils'
import _ from 'lodash'

const str = new LookoutStrings(LANG)
    const misc = miscStrings[LANG]

    let lookout = {
        name: 'Lookout',
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

        // Create a poll to look for a player
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

        // display investigation result
        resolveNightAbility(player, events) {
            return new Promise((resolve, reject) => {
                const resPoll = player.poll.getMaxVoted()
                    console.log("lookout 1")
                    let text = ''
                    if (resPoll.maxVote > 0) {
                        const target = _.find(player.game.players, { name: resPoll.targets[0] })
                        console.log("lookout 2")
                        console.log(target)
                            const visits = _.filter(events, e => { return (e.type == 'visit' && e.target == target.name && e.player != player.name) })
                            console.log("lookout 3")
                            console.log(visits)
                            text += str.resolveNightAbility('trackingResult') + str.resolveNightAbility('hasBeenVisited', '<@'+target.id+'>')
                            if (visits.length > 0) {
                                _.forEach(visits, visit => {
                                    let visitPlayer = _.find(player.game.players, { name: visit.player })
                                    if (visitPlayer) {
                                        text += '*' + visitPlayer.getDisplayedName() + '*, '
                                    }
                                    
                                })
                                console.log("lookout 4")
                            } else {
                                text += str.resolveNightAbility('noVisit')
                                console.log("lookout 5")
                            }
                    } else {
                        text = str.resolveNightAbility('noInvestigation')
                        console.log("lookout 6")
                    }
                player.game.postMessage(player.id, text)
                    .then(() => resolve(true))
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

export default lookout
