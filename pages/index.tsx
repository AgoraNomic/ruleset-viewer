import React from "react"
import { GetStaticProps, InferGetStaticPropsType } from "next"
import Head from "next/head"
import parseRuleset, { Ruleset } from "../lib/ruleset-parser"
import Group from "../components/Group"
import Styles from "../styles/index.module.css"
import TableOfContents from "../components/TableOfContents"
import { Waypoint } from "react-waypoint"
import Immutable from "immutable"
import { getGitHubData } from "lib/github-api"

class Home extends React.Component<
  InferGetStaticPropsType<typeof getStaticProps>,
  {
    visibleGroups: Immutable.Set<String>
    showingHistory: Immutable.Set<number>
  }
> {
  render() {
    return (
      <div className={Styles.home}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css?family=Merriweather:400,400i,700"
            rel="stylesheet"
          />
        </Head>
        <main className={Styles.main}>
          <p className={Styles.updated}>
            Last updated {new Date(this.props.updateTime).toLocaleString()}
          </p>
          {this.props.ruleset.map((group) => (
            <Waypoint
              onEnter={() =>
                this.setState({
                  visibleGroups: this.state.visibleGroups.add(group.name),
                })
              }
              onLeave={() =>
                this.setState({
                  visibleGroups: this.state.visibleGroups.remove(group.name),
                })
              }
              fireOnRapidScroll={true}
              key={group.name}
            >
              <div>
                <Group
                  group={group}
                  toggleHistory={this.toggleHistory.bind(this)}
                  showingHistory={this.state.showingHistory}
                />
              </div>
            </Waypoint>
          ))}
        </main>
        <TableOfContents
          ruleset={this.props.ruleset}
          visible={this.state.visibleGroups}
        />
      </div>
    )
  }

  toggleHistory(id: number) {
    this.setState({
      showingHistory: this.state.showingHistory.has(id)
        ? this.state.showingHistory.remove(id)
        : this.state.showingHistory.add(id),
    })
  }

  state = { visibleGroups: Immutable.Set(), showingHistory: Immutable.Set() }
}

export const getStaticProps: GetStaticProps<{
  ruleset: Ruleset
  updateTime: number
}> = async function getStaticProps() {
  return {
    props: {
      ruleset: parseRuleset(await getGitHubData()),
      updateTime: new Date().getTime(),
    },
    revalidate: 3600,
  }
}

export default Home
