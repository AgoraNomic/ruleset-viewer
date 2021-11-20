import YAML from "yaml"
import * as History from "./history"
import { DirTree } from "./get-repo"

function checkNull<T>(thing: T | null | undefined, message: string): T {
  if (thing == undefined) {
    throw new Error(message)
  }

  return thing
}

function getDir(entries: DirTree, name: string): DirTree {
  const entry = checkNull(entries[name], `No ${name} folder.`)
  if (typeof entry == "object") {
    return entry
  } else {
    throw new Error(`${name} isn't a folder`)
  }
}

function getYAMLFile<T>(entries: DirTree, name: string): T {
  const entry = checkNull(entries[name], `${name} doesn't exist`)
  if (typeof entry == "string") {
    return YAML.parse(entry)
  } else {
    throw new Error(`${name} isn't a file`)
  }
}

type RuleIndexRaw = {
  name: string
  note: string
  rules: number[]
}[]

interface RuleRaw {
  id: number
  name: string
  power: number
  text: string
  history: History.HistoryItem[]
  annotations: {}[]
}

export interface Rule {
  id: number
  name: string
  power: number
  text: string
  history: History.HistoryItem[]
  annotations: {}[]
  rev: number
  asciiart?: boolean | undefined
}

export type Ruleset = Group[]

export type GroupRaw = {
  name: string
  note: string
  rules: RuleRaw[]
}

export type Group = {
  name: string
  note: string
  rules: Rule[]
}

export default function parseRuleset(data: DirTree): Ruleset {
  const root = getDir(data, "ruleset-main")
  const rulesData = getDir(root, "rules_data")
  const configEntries = getDir(rulesData, "config")
  const index = getYAMLFile<RuleIndexRaw>(configEntries, "index")

  const rulesEntries = getDir(rulesData, "rules")

  return index.map((group) => {
    const rules = group.rules.map((id) => {
      const rule = getYAMLFile<RuleRaw>(rulesEntries, id.toString())
      const rev = rule.history.filter(History.shouldCountRev).length
      return { ...rule, rev }
    })
    return { ...group, rules }
  })
}
