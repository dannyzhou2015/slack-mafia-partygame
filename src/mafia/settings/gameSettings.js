let gameSettings = {
    LANG: 'en',
    GROUPS: {
        'mafia-hideout': 'mafia-room'
    },
    CHANNELS: {
        'town-center': 'town-room'
    },

    SETUP: 'default',
    DATABASE_TABLE: 'normal',

    timers: {
        DAY_DEBATE: 1,
        DAY_DEBATE_POLL: 1,
        DAY_TRIAL: 1,
        DAY_TRIAL_POLL: 1,

        MAFIA_LYNCH: 10,
        NIGHT_ACTIVITY: 10
    }

}

export default gameSettings
export const {
    LANG,
    GROUPS,
    CHANNELS,
    SETUP,
    DATABASE_TABLE
} = gameSettings
export const {
    DAY_DEBATE,
    DAY_DEBATE_POLL,
    DAY_TRIAL,
    DAY_TRIAL_POLL,
    MAFIA_LYNCH,
    NIGHT_ACTIVITY
} = gameSettings.timers
