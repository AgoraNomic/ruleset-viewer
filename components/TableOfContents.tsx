import React from 'react'
import Immutable from 'immutable'

import { Ruleset } from '../lib/ruleset-parser'

import Styles from '../styles/TableOfContents.css'

export default function TableOfContents (props: {ruleset: Ruleset, visible: Immutable.Set<string>}) {
    return <ul className={Styles.toc}>
        {props.ruleset.map(group => 
            <li key={group.name}>
                <a
                    href={"#" + group.name.replace(/[ &]/g, '')}
                    className={Styles.item + ' ' + (props.visible.includes(group.name) && Styles.active)}
                >{group.name}</a>
            </li>
        )}
    </ul>
}