import * as Query from './query'
import YAML from 'yaml'
import * as History from './history'

function checkNull<T>(thing: T | null | undefined, message: string): T {
	if(thing == undefined) {
		throw new Error(message)
	}

	return thing
}

function getSubtreeEntries(entries: Query.SelectionOnEntries1[], name: string) {
	const entry = checkNull(entries.find(e => e.name == name), `No ${name} folder.`)
	const object = checkNull(entry.object, "WHAT")
	return checkNull(object.entries, `${name} isn't a folder`)
}

function getYAMLFile<T>(entries: Query.SelectionOnEntries[], name: string): T {
	const entry = checkNull(entries.find(e => e.name == name), `${name} doesn't exist`)
	const object = checkNull(entry.object, "WHAAAT")
	const text = checkNull(object.text, `${name} isn't a file`)
	return YAML.parse(text)
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

export default function parseRuleset(data: Query.RulesetQuery): Ruleset {
	const repo = checkNull(data.repository, "Repo doesn't exist.")
	const ref = checkNull(repo.ref, "Master branch doesn't exist.")
	const tree = checkNull(ref.target.tree, "Master branch is very confused.")
	const entries = checkNull(tree.entries, "OK, what?")
	const configEntries = getSubtreeEntries(entries, "config")
	const index = getYAMLFile<RuleIndexRaw>(configEntries, "index")

	const rulesEntries = getSubtreeEntries(entries, "rules")

	return index.map(group => {
		const rules = group.rules.map(id => {
			const rule = getYAMLFile<RuleRaw>(rulesEntries, id.toString())
			const rev = rule.history.filter(History.shouldCountRev).length
			return {...rule, rev}
		})
		return { ...group, rules }
	})
}