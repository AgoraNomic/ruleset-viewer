import React from "react"
import { Group as GroupType } from "../lib/ruleset-parser"
import Rule from "./Rule"
import Immutable from "immutable"

import Styles from "../styles/Group.module.css"

export default function Group({
  group,
  toggleHistory,
  showingHistory,
}: {
  group: GroupType
  toggleHistory: (id: number) => void
  showingHistory: Immutable.Set<number>
}) {
  return (
    <div>
      <a id={group.name.replace(/[ &]/g, "")} />
      <div className={Styles.header}>
        <h1>{group.name}</h1>
        <p className={Styles.note}>{group.note}</p>
      </div>
      {group.rules.map((rule) => (
        <Rule
          rule={rule}
          toggleHistory={() => toggleHistory(rule.id)}
          showHistory={showingHistory.has(rule.id)}
          key={rule.id}
        />
      ))}
    </div>
  )
}
