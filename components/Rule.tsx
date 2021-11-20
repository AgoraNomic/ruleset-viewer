import React from "react"
import { Rule as RuleType } from "../lib/ruleset-parser"
import Styles from "../styles/Rule.module.css"
import Markdown from "react-markdown"
import keywords from "../lib/keywords.json"
import History from "./History"

function addKeywords(text: string, id: number) {
  Object.keys(keywords).forEach((keyword) => {
    if ((keywords as { [keyword: string]: number })[keyword] !== id) {
      text = text.replace(
        new RegExp("\\b" + keyword + "\\b"),
        `[${keyword}](#Rule${
          (keywords as { [keyword: string]: number })[keyword]
        })`
      )
    }
  })
  return text
}

function Rule({
  rule,
  toggleHistory,
  showHistory,
}: {
  rule: RuleType
  toggleHistory: () => void
  showHistory: boolean
}) {
  return (
    <div>
      <a id={"Rule" + rule.id} />
      <h2 className={Styles.title}>
        <span className={Styles.id}>
          {rule.id}
          <span className={Styles.rev}>/{rule.rev}</span>
        </span>
        {rule.name}
        <span className={Styles.power}>Power {rule.power}</span>
      </h2>
      <div className={Styles.text}>
        {rule.asciiart ? (
          <pre>{rule.text}</pre>
        ) : (
          <Markdown children={addKeywords(rule.text, rule.id)} />
        )}
      </div>
      <span className={Styles.links}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            toggleHistory()
          }}
        >
          History
        </a>
      </span>
      {showHistory && <History history={rule.history} />}
    </div>
  )
}

export default React.memo(
  Rule,
  (prev, next) => prev.rule == next.rule && prev.showHistory == next.showHistory
)
