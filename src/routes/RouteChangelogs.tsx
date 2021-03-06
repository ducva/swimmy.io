import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { take } from 'rxjs/operators'
import CardChangelog from '../components/CardChangelog'
import ViewTitle from '../components/ViewTitle'
import { CHANGELOGS } from '../constants/collection'
import { DESC } from '../constants/order'
import { createdAt } from '../helpers/createdAt'
import { Changelog } from '../interfaces/models/changelog'
import { ChangelogUi } from '../interfaces/models/changelogUi'
import { px } from '../libs/styles/px'
import { resetList } from '../libs/styles/resetList'
import { toVersionStr } from '../libs/toVersionStr'

const RouteChangelogs: FunctionComponent = () => {
  const classes = useStyles({})
  const [changelogs, setChangelogs] = useState<ChangelogUi[]>([])
  const [inProgress, setInProgress] = useState(true)

  useEffect(() => {
    const query = firestore()
      .collection(CHANGELOGS)
      .limit(40)
      .orderBy('version', DESC)
    const subscription = collectionData<Changelog>(query)
      .pipe(take(2))
      .subscribe(docs => {
        setChangelogs([
          ...docs.map(doc => ({
            ...doc,
            ui: {
              date: createdAt(doc.date, false),
              version: toVersionStr(doc.version)
            }
          }))
        ])
        setInProgress(false)
      })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (inProgress) {
    return <CircularProgress className={classes.progress} />
  }

  return (
    <Fade in>
      <main className={classes.root}>
        <ViewTitle
          hide={false}
          title={'アップデート履歴'}
          description={
            'バージョン3.0.0以降の過去のアップデート履歴を確認できます。'
          }
        />
        <ul className={classes.changelogs}>
          {changelogs.map(changelog => (
            <li key={changelog.id}>
              <CardChangelog
                version={changelog.ui.version}
                date={changelog.ui.date}
                contents={changelog.contents}
              />
            </li>
          ))}
        </ul>
      </main>
    </Fade>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    changelogs: {
      ...resetList(),
      display: 'grid',
      gridRowGap: px(spacing.unit * 2),
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2
    },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing.unit * 10
    },
    root: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 2)
    }
  }
})

export default RouteChangelogs
