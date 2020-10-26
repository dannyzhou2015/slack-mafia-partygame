const setups = {
    1: [
        {
            id: 'default',
            roles: ['Mafioso']
        }
    ],
    // const arrayRoles = [arsonist, bodyguard, citizen, cop, consigliere, consort,
    //     doctor, escort, framer, godfather, investigator, janitor, jester, lookout,
    //     mafioso, serialKiller, survivor, tracker, veteran, vigilante]
    2: [
        {
            id: 'default',
            roles: ["Janitor", 'Lookout'],
            // configurations: {
            //     'Neutral Benign': 1,
            //     'Mafia Support': 1
            //}
        }
    ],
    4: [
    {
        id: 'default',
        roles: ['Framer', 'Janitor', 'Veteran', 'Arsonist'],
        configurations: {
            'Town Protective': 1
        }
    }
    ],
    5: [
    {
        id: 'default',
        roles: ['Citizen', 'Citizen', 'Mafioso', 'Citizen', 'Doctor']
    }
    ],
    6: [
    {
        id: 'default',
        roles: ['Citizen', 'Citizen', 'Mafioso', 'Citizen', 'Doctor'],
        configurations: {
            'Neutral Benign' : 1
        }
    }
    ],
    7: [
    {
        id: 'default',
        roles: ['Mafioso', 'Mafioso', 'Doctor', 'Citizen', 'Citizen', 'Citizen'],
        configurations: {
            'Town' : 1
        }
    }
    ],
    8: [
    {
        id: 'default',
        roles: ['Mafioso', 'Godfather', 'Doctor', 'Citizen', 'Citizen', 'Citizen'],
        configurations: {
            'Town' : 1,
            'Neutral' : 1
        }
    }
    ],
    9: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Mafioso', 'Doctor'],
        configurations: {
            'Town Protective': 1,
            'Town': 1,
            'Town': 1,
            'Mafia Support': 1,
            'Neutral': 1
        }
    }
    ],
    10: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Mafioso', 'Doctor'],
        configurations: {
            'Town Protective': 1,
            'Town': 1,
            'Town': 1,
            'Mafia Support': 1,
            'Neutral': 1,
            'Neutral Killing': 1
        }
    }
    ],
    11: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Doctor'],
    }
    ],
    12: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Doctor'],
    }
    ],
    13: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Doctor'],
    }
    ],
    14: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Doctor'],
    }
    ],
    15: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Doctor'],
    }
    ],
    16: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Doctor'],
    }
    ],
    17: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Doctor'],
    }
    ],
    18: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Doctor'],
    }
    ],
    19: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Doctor'],
    }
    ],
    20: [
    {
        id: 'default',
        roles: ['Cop', 'Godfather', 'Doctor'],
    }
    ]
}

export default setups
