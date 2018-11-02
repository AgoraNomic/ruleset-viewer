import React from 'react'
import { NextComponentClass, NextContext } from "next"
import Head from "next/head"
import { RulesetQuery } from '../lib/query'
import parseRuleset, { Ruleset } from '../lib/ruleset-parser'
import Group from '../components/Group'
import Styles from './index.css'
import TableOfContents from '../components/TableOfContents'
import Waypoint from 'react-waypoint';
import Immutable from 'immutable';

class Home extends React.Component<{ruleset: Ruleset}> {
	render() {
		return <div className={Styles.home}>
			<Head>
				<link href="https://fonts.googleapis.com/css?family=Merriweather:400,400i,700" rel="stylesheet" />
			</Head>
			<main className={Styles.main}>
				{this.props.ruleset.map(group =>
					<Waypoint
						onEnter={() => this.setState({visibleGroups: this.state.visibleGroups.add(group.name)})}
						onLeave={() => this.setState({visibleGroups: this.state.visibleGroups.remove(group.name)})}
						fireOnRapidScroll={true}
						key={group.name}
					>
						<div><Group group={group} /></div>
					</Waypoint>
				)}
			</main>
			<TableOfContents ruleset={this.props.ruleset} visible={this.state.visibleGroups} />
		</div>;
	}

	static async getInitialProps({req}: NextContext) {
		if(req) {
			const {getGitHubData} = await import('../lib/github-api')
			return {ruleset: parseRuleset(await getGitHubData())}
		} else {
			return {ruleset: parseRuleset(await ((await fetch('/data')).json() as Promise<RulesetQuery>))}
		}
	}

	state = {visibleGroups: Immutable.Set()}
}

const _typecheck: NextComponentClass<{ruleset: Ruleset}> = Home
{foo: _typecheck}

export default Home
