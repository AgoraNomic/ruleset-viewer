import React from 'react'
import {Rule as RuleType} from '../lib/ruleset-parser'
import Styles from './Rule.css'
import Markdown from 'react-markdown'
import asciiRules from '../lib/ascii-rules.json'
import keywords from '../lib/keywords.json'

function addKeywords(text: string) {
    Object.keys(keywords).forEach(keyword => {
        text = text.replace(new RegExp("\\b" + keyword + "\\b"), `[${keyword}](#Rule${(keywords as {[keyword: string]: number})[keyword]})`)
    })
    return text
}

export default function Group({rule}: {rule: RuleType}) {
    return <div>
        <a id={"Rule" + rule.id} />
        <h2 className={Styles.title}>
            <span className={Styles.id}>
                {rule.id}<span className={Styles.rev}>/{rule.rev}</span>
            </span>
            {rule.name}
            <span className={Styles.power}>Power {rule.power}</span>
        </h2>
        <div className={Styles.text}>
            {asciiRules.includes(rule.id) ? <pre>{rule.text}</pre> : <Markdown source={addKeywords(rule.text)} />}
        </div>
    </div>
}