import React from 'react';
import * as H from '../lib/history';
import Styles from '../styles/History.css';

function addRevs(history: H.HistoryItem[]) {
    let rev = 0
    return history.map(item => {
        if(H.shouldCountRev(item)) {
            rev++
            return {...item, rev}
        } else {
            return {...item, rev: null}
        }
    })
}

export default function History({history}: {history: H.HistoryItem[]}) {
    return <ul className={Styles.history}>
        {addRevs(history).map((item, idx) => 
            <li key={idx}>
                <span className={Styles.rev}>{item.rev}</span>
                <Change change={item.change} />{item.agent && <> by <Agent agent={item.agent} /> </>}
                <Datestamp date={item.date} />
            </li>
        )}
    </ul>
}

function Change({change}: {change: H.Change}) {
    switch(change.type) {
        case 'enactment':
        return <span>Enacted</span>
        case 'initial':
        return <span>Initial {change.mutability} rule {change.id}</span>
        case 'mutation':
        return <span>
            Mutated
            {change['old-mi'] && (' from MI=' + change['old-mi'])}
            {change['new-mi'] && (' to MI=' + change['new-mi'])}
        </span>
        case 'renumbering':
        return <span>Renumbered</span>
        case 'reenactment':
        return <span>Reenacted and amended</span>
        case 'amendment':
        return <span>Amended</span>
        case 'infection-amendment':
        return <span>Infected and amended</span>
        case 'infection':
        return <span>Infected</span>
        case 'retitling':
        return <span>Retitled</span>
        case 'repeal':
        return <span>Repealed</span>
        case 'power-change':
        return <span>
            Power changed
            {change['old-power'] && (' from ' + change['old-power'])}
            {change['new-power'] && (' to ' + change['new-power'])}
        </span>
        case 'committee-assignment':
        return <span>Assigned to the {change.committee}</span>
        default:
        throw new Error('Unknown change type ' + change.type);
    }
}

function Agent({agent}: {agent: H.Agent}) {
    if("proposal" in agent) {
        return <span>Proposal {agent.proposal}</span>
    } else if ("rule" in agent) {
        return <span>Rule {agent.rule}</span>
    } else if ("convergance" in agent) {
        return <span>a convergance caused by <Agent agent={agent.convergance} /></span>
    } else if ("cleaning" in agent) {
        return <span>cleaning ({agent.cleaning.by}</span>
    } else if ("ratification" in agent) {
        return <span>{agent.ratification.document} ratification</span>
    } else if ("decree" in agent) {
        return <span>decree given by {agent.decree}</span>
    } else {
        throw new Error("Unknown agent type " + Object.keys(agent))
    }
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}
function Datestamp({date}: {date: H.Datestamp}) {
    if(typeof date == 'object' && "around" in date) {
        return <span className={Styles.datestamp}> around {formatDate(date.around)}</span>
    } else if (typeof date == 'object' && "between" in date) {
        return <span className={Styles.datestamp}>
            between {formatDate(date.between)} and {formatDate(date.and)}
        </span> 
    } else {
        return <span className={Styles.datestamp}>{' ' + formatDate(date)}</span>
    }
}