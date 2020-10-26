import SlackBot from 'slackbots'
import Slack from 'slack-node'
import Game from './Game'
import { GROUPS, CHANNELS } from './settings/gameSettings'
import _ from 'lodash'
import { EventEmitter } from 'events'
import async from 'async'
import { SSL_OP_NO_TICKET } from 'constants'

process.on('uncaughtException', (err, origin) => {
    fs.writeSync(
      process.stderr.fd,
      `Caught exception: ${err}\n` +
      `Exception origin: ${origin}`
    );
  });

export default class MafiaGameMaster {
    constructor() {
        this.mafiaPartyGame = null
            this.masterEmitter = new EventEmitter()
            this.bot = new SlackBot({
                token: process.env.MAFIA_API_TOKEN,
                name: process.env.MAFIA_API_NAME,
                username: process.env.MAFIA_API_USERNAME
            })
            this.gameNumber = 1;
        this.botStartListener = () => {
            this.slackApi = new Slack(process.env.MAFIA_API_TOKEN)
            this.slackApiUser2 = new Slack(process.env.MAFIA_API_TOKEN_USER_2)
            this.slackApiUser = new Slack(process.env.MAFIA_API_TOKEN_USER)
                console.log("123123123");
                // console.log(this.bot);
                // console.log(this.bot.self.name)
                // console.log(this.bot.self.id)
                //return
                //this.bot.self.id = this.bot.self.name;
                this.slackApi.botID = this.bot.self.id
                this.slackApi.botIM = "D01BNF99HL3" //_.find(this.bot.ims, { id: this.bot.self.id })
                //.id
                console.log("123123123123");
                this.botHasStarted = true
                this.listen()
        }
        this.bot.on('start', this.botStartListener)
    }

    listen() {
        this.botListener = (data) => {
            if (data.type == 'message' && data.text) {
                if ((data.text)
                        .slice(0, 6) == '!mafia') {
                    const command = _.lowerCase(data.text.slice(7))
                        this.runCommands(command)
                } else if (data.user != this.slackApi.botID) {
                    this.dispatchEvents('message', data)
                }
            }
        }
        this.bot.on('message', this.botListener)
    }

    runCommands(command) {
        switch (command) {
            case 'newgame':
                this.newGame()
                    break
            case 'qs':
            case 'quickstart':
                this.newGame(true)
                    break
            default:
                    this.dispatchEvents('command', command)
        }
    }

    dispatchEvents(category, data) {
        this.masterEmitter.emit(category, data)
    }

    newGame(isQuickStart) {
        if (!this.mafiaPartyGame) {
            this.prepareMafiaPartyGame()
                .then((chans) => {
                    this.mafiaPartyGame = new MafiaPartyGame(this, chans)
                    if (isQuickStart) {
                        this.mafiaPartyGame.quickStart();
                    }
                })
        } else if (this.mafiaPartyGame.gameDone()) {
            //this.initGameGroups()
            //this.gameNumber++;
            this.mafiaPartyGame.unListen();
            this.prepareMafiaPartyGame()
                .then((chans) => {
                    this.mafiaPartyGame = new MafiaPartyGame(this, chans)
                    if (isQuickStart) {
                        this.mafiaPartyGame.quickStart();
                    }
                })
        } else {
            console.log('game already created')
        }
    }

    getChannels() {
        return new Promise((resolve, reject) => {
            //resolve(this.bot.channels);
            this.slackApiUser.api('conversations.list', (err, response) => {
                if (response.ok) {
                    console.log("retrieved channels: ")
                    resolve(response.channels)
                } else {
                    console.log("error2")
                    //console.log(response)
                    console.log(err)
                }
            })
        })
    }

    getGroups() {
        return new Promise((resolve, reject) => {
            //resolve(this.bot.channels);
            this.slackApiUser.api('conversations.list', { types: 'private_channel' }, (err, response) => {
                if (response.ok) {
                    console.log("retrieved groups: ")
                    //console.log(response)
                    resolve(response.channels)
                } else {
                    console.log("error3")
                    //console.log(response)
                    console.log(err)
                }
            })
        })
    }

    getMembers(channelID) {
        return new Promise((resolve, reject) => {
            //resolve(this.bot.channels);
            this.slackApiUser.api('conversations.members', { channel: channelID }, (err, response) => {
                if (response.ok) {
                    console.log("retrieved channel members: ")
                    resolve(response.members)
                } else {
                    console.log("error2")
                    //console.log(response)
                    console.log(err)
                }
            })
        })
    }

    channelKick(channel) {
        return new Promise((resolve, reject) => {
            this.getMembers(channel.id)
                .then(members => {
                    async.forEach(members, (member, callback) => {
                        //console.log(member)
                        if (member != this.slackApiUser.botID || member != this.slackApi.botID) {
                            this.slackApiUser.api('conversations.kick', { channel: channel.id, user: member }, (err, response) => {console.log("channel kick result: ");console.log(response); callback()} /*() => callback()*/)
                        } else {
                            callback()
                        }
                    }, () => resolve(true))
                })
        })
    }

    // groupKick(group) {
    //     return new Promise((resolve, reject) => {
    //         async.forEach(group.members, (member, callback) => {
    //             console.log(member)
    //             if (member != this.slackApiUser.botID || member != this.slackApi.botID) {
    //                 this.slackApiUser.api('conversations.kick', { channel: group.id, user: member },  (err, response) => {console.log("group kick result: ");console.log(response); callback()} /*() => callback()*/)
    //             } else {
    //                 callback()
    //             }
    //         }, () => resolve(true))
    //     })
    // }


    initGameChannels(channels) {
        return new Promise((resolve, reject) => {
            const chans = []
                async.forEach(_.keys(CHANNELS), (chan, callback) => {
                    let existingChan = _.find(channels, { name: chan })
                        if (existingChan) {
                            console.log(existingChan)
                            chans.push({ id: existingChan.id, name: existingChan.name, category: CHANNELS[chan] })
                                callback()
                                // if (process.env.MAFIA_ENV == 'DEBUG') {
                                //     callback()
                                // } else {
                                //     console.log("kicking from existing channel..")
                                //     this.channelKick(existingChan)
                                //         .then(() => callback())
                                // }
                        } else {
                            console.log("No existing chan found!")
                            //process.exit()
                            this.slackApiUser.api('conversations.create', { name: chan }, (err, response) => {
                                if (response.ok) {
                                    chans.push({ id: response.channel.id, name: response.channel.name, category: CHANNELS[chan] })
                                        callback()
                                } else {
                                    console.log('Creating channel ' + chan + ' failed:')
                                        console.log(response)
                                }
                            })
                        }
                }, () => resolve(chans))
        })
    }

    initGameGroups(groups) {
        return new Promise((resolve, reject) => {
            const chans = []
                async.forEach(_.keys(GROUPS), (group, callback) => {
                    //console.log(groups)
                    // group = group + '-' + this.gameNumber.toString().padStart(3, '0')
                    // console.log(group)
                    let existingGroup = _.find(groups, { name: group })
                        if (existingGroup) {
                            console.log("kicking from existing group..")
                            chans.push({ id: existingGroup.id, name: existingGroup.name, category: GROUPS[group] })
                                this.channelKick(existingGroup)
                                .then(() => callback())

                            // console.log("deleteting existing group..")
                            // this.slackApiUser.api('conversations.delete', { channel: group }, (err, response) => {
                            //     if (response.ok) {
                            //         console.log("group deleted!")
                            //         console.log(response)
                            //         chans.push({ id: response.channel.id, name: response.channel.name, category: GROUPS[group] })
                            //             callback()
                            //             this.slackApiUser.api('conversations.create', { name: group, is_private: true }, (err, response) => {
                            //                 if (response.ok) {
                            //                     console.log("group created!")
                            //                     console.log(response)
                            //                     chans.push({ id: response.channel.id, name: response.channel.name, category: GROUPS[group] })
                            //                         callback()
                            //                 } else {
                            //                     console.log('Creating group ' + group + ' failed:')
                            //                         console.log(response)
                            //                 }
                            //             })
                            //     } else {
                            //         console.log('deleting group ' + group + ' failed:')
                            //             console.log(response)
                            //     }
                            // })
                            // // chans.push({ id: existingGroup.id, name: existingGroup.name, category: GROUPS[group] })
                            // //     this.channelKick(existingGroup)
                            // //     .then(() => callback())
                        } else {
                            console.log("No existing group found!")
                            //process.exit()
                            this.slackApiUser.api('conversations.create', { name: group, is_private: true }, (err, response) => {
                                if (response.ok) {
                                    console.log("group created!")
                                    console.log(response)
                                    chans.push({ id: response.channel.id, name: response.channel.name, category: GROUPS[group] })
                                        callback()
                                } else {
                                    console.log('Creating group ' + group + ' failed:')
                                        console.log(response)
                                }
                            })
                        }
                }, () => resolve(chans))
        })
    }

    prepareMafiaPartyGame() {
        return new Promise((resolve, reject) => {
            async.parallel({
                chans: (callback) => {
                    this.getChannels()
                        .then(channels => this.initGameChannels(channels))
                        .then((channels) => callback(null, channels))
                },
                groups: (callback) => {
                    this.getGroups()
                        .then(groups => this.initGameGroups(groups))
                        .then((groups) => callback(null, groups))
                }
            }, (err, results) => resolve(_.concat(results.chans, results.groups)))
        })
    }
}

export class MafiaPartyGame {
    constructor(mafiaGameMaster, chans) {
        this.mafiaGameMaster = mafiaGameMaster
            this.chans = chans
            this.game = null
            this.initiated = false
            this.started = false
            this.eventEmitter = new EventEmitter()
            console.log(chans)
            console.log('new game created')
            this.listen()
    }

    listen() {
        this.masterEmitterCommandListener = (command) => this.runCommands(command)
        this.masterEmitterMessageListener = (data) => this.eventEmitter.emit('message', data)
        this.mafiaGameMaster.masterEmitter.on('command', this.masterEmitterCommandListener)
        this.mafiaGameMaster.masterEmitter.on('message', this.masterEmitterMessageListener)
    }

    unListen() {
        this.mafiaGameMaster.masterEmitter.removeListener("command", this.masterEmitterCommandListener)
        this.mafiaGameMaster.masterEmitter.removeListener("message", this.masterEmitterMessageListener)
    }

    gameDone() {
        if (!this.game) {
            return false
        }
        return this.game.gameDone
    }

    runCommands(command) {
        switch (command) {
            case 'setroles':
                if (!this.rolesAlreadySet) {
                    this.setRoles()
                    this.rolesAlreadySet = true
                } else {
                    console.log("roles already set!")
                }
                
                    break
            case 'startgame':
                    this.startGame()
                        break
            default:
                        console.log('unknown command: ' + command)
        }
    }

    setRoles() {
        this.initiated = true
            this.getChannelPlayers(_.find(this.chans, { category: 'town-room' })
                    .id)
            .then(players => {
                //console.log("init game")
                //console.log(players)
                    this.game = new Game(this.eventEmitter, this.mafiaGameMaster.slackApi, this.mafiaGameMaster.slackApiUser, players, this.chans, this.mafiaGameMaster)
                    this.game.init()
            })
    }

    startGame() {
        if (this.initiated && !this.started) {
            this.started = true
                this.game.start()
        }
    }

    quickStart() {
        this.initiated = true
            this.getChannelPlayers(_.find(this.chans, { category: 'town-room' })
                    .id)
            .then(players => {
                //console.log("init game")
                //console.log(players)
                    this.game = new Game(this.eventEmitter, this.mafiaGameMaster.slackApi, this.mafiaGameMaster.slackApiUser, players, this.chans, this.mafiaGameMaster)
                    this.game.init()
                    this.started = true
                    this.game.start()
            })
    }

    getPlayers() {
        return new Promise((resolve, reject) => {
            const players = []
                this.mafiaGameMaster.slackApiUser.api('users.list', (err, response) => {
                    if (response.ok) {
                        //console.log("players: ")
                        //console.log(response)
                        _.forEach(response.members, member => {
                            if (!member.is_bot && member.name != 'slackbot' && member.name != process.env.MAFIA_API_NAME && member.name != process.env.MAFIA_API_USERNAME) {
                                players.push(_.pick(member, ['id', 'name']))
                            }
                        })
                        resolve(players)
                    } else {
                        console.log('cannot retrieve users list')
                    }
                })
        })
    }

    getChannelPlayers(chanID) {
        return new Promise((resolve, reject) => {
            console.log("chanID is "+chanID)
            const channelPlayers = []
                this.mafiaGameMaster.slackApiUser.api('conversations.members', { channel: chanID }, (err, response) => {
                    this.getPlayers()
                        .then(players => {
                            _.forEach(players, p => {
                                //console.log("channel players: ")
                                //console.log(p)
                                //console.log(response)
                                if (_.indexOf(response.members, p.id) > -1) {
                                    console.log("pushing")
                                    console.log(p)
                                    channelPlayers.push(p)
                                }
                            })
                            resolve(channelPlayers)
                        })
                })
        })
    }
}
