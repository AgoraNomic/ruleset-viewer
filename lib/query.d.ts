export interface IFragmentSpreadOnBlob {
text: string | null;
}

export interface SelectionOnEntries {
name: string;
object: Partial<IFragmentSpreadOnBlob> | null;
}

export interface IFragmentSpreadOnTree {
entries: Array<SelectionOnEntries> | null;
}

export interface IFragmentSpreadOnBlob {
text: string | null;
}

export interface SelectionOnEntries1 {
name: string;
object: Partial<IFragmentSpreadOnTree> & Partial<IFragmentSpreadOnBlob> | null;
}

export interface SelectionOnTree {
entries: Array<SelectionOnEntries1> | null;
}

export interface IFragmentSpreadOnCommit {
tree: SelectionOnTree;
}

export interface SelectionOnRef {
name: string;
target: Partial<IFragmentSpreadOnCommit>;
}

export interface SelectionOnRepository {
ref: SelectionOnRef | null;
}

export interface RulesetQuery {
repository: SelectionOnRepository | null;
}