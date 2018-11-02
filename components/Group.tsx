import React from 'react'
import {Group as GroupType} from '../lib/ruleset-parser'
import Rule from './Rule'

import Styles from './Group.css'

export default function Group({group}: {group: GroupType}) {
    return <div>
        <a id={group.name.replace(/[ &]/g, '')}/>
        <div className={Styles.header}>
            <h1>{group.name}</h1>
            <p className={Styles.note}>{group.note}</p>
        </div>
        {group.rules.map(rule => <Rule rule={rule} key={rule.id} />)}
    </div>
}