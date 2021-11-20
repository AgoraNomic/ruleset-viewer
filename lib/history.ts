export type HistoryItem<ChangeType = Change, AgentType = Agent> = {
  change: ChangeType
  agent?: AgentType
  date: Datestamp
}

export type Change =
  | Enactment
  | Initial
  | Mutation
  | Renumbering
  | Reenactment
  | Amendment
  | InfectionAmendment
  | Infection
  | Retitling
  | Repeal
  | PowerChange
  | CommitteeAssignment
  | Unknown

export interface Enactment {
  type: "enactment"
}

export interface Initial {
  type: "initial"
  mutability: "immutable" | "mutable"
  id: number
}

export interface Mutation {
  type: "mutation"
  "old-mi"?: string
  "new-mi"?: string
}

export interface Renumbering {
  type: "renumbering"
}

export interface Reenactment {
  type: "reenactment"
}

export interface Amendment {
  type: "amendment"
  uncounted?: boolean
}

export interface InfectionAmendment {
  type: "infection-amendment"
}

export interface Infection {
  type: "infection"
}

export interface Retitling {
  type: "retitling"
}

export interface Repeal {
  type: "repeal"
}

export interface PowerChange {
  type: "power-change"
  "old-power"?: number
  "new-power"?: number
}

interface CommitteeAssignment {
  type: "committee-assignment"
  committee: "string"
}

interface Unknown {
  type: "unknown"
}

export type Agent =
  | Proposal
  | Rule
  | Convergance
  | Cleaning
  | Ratification
  | Decree

interface Proposal {
  proposal: number
}

interface Rule {
  rule: number
}

interface Convergance {
  convergance: Agent
}

interface Cleaning {
  cleaning: { by: string }
}

interface Ratification {
  ratification: { document: string }
}

interface Decree {
  decree: string
}

export type Datestamp =
  | string
  | { around: string }
  | { between: string; and: string }

export function shouldCountRev(item: HistoryItem) {
  return (
    item.change.type == "reenactment" ||
    item.change.type == "infection-amendment" ||
    (item.change.type == "amendment" && !item.change.uncounted)
  )
}
