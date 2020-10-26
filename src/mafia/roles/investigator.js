import { NIGHT_ACTIVITY, LANG } from '../settings/gameSettings'
import InvestigatorStrings from '../strings/roles/investigator'
import miscStrings from '../strings/misc'
import Poll from '../Poll'
import { sleep } from '../utils'
import _ from 'lodash'

const str = new InvestigatorStrings(LANG)
    const misc = miscStrings[LANG]

    let investigator = {
        name: 'Investigator',
        affiliation: 'Town',
        category: 'Town Supportive', //caveat solved
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
        resolveNightAbility(player) {
            return new Promise((resolve, reject) => {
                const resPoll = player.poll.getMaxVoted()
                    let text = ''
                    if (resPoll.maxVote > 0) {
                        const target = _.find(player.game.players, { name: resPoll.targets[0] })
                            let investigationResult
                            if (target.role.params.immuneDetection) {
                                investigationResult = [misc.crimes.noCrime]
                            } else if (target.isFramed) {
                                investigationResult = _.concat(target.crimes, _.sample(misc.crimes))
                            } else {
                                investigationResult = target.getCrimes()
                            }
                        investigationResult = _.join(investigationResult, ', ')
                            text = str.resolveNightAbility('investigationResult', { name: '<@'+target.id+'>', result: investigationResult })
                    } else {
                        text = str.resolveNightAbility('noInvestigation')
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

export default investigator
