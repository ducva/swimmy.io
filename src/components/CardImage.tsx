import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { PostUi } from '../interfaces/models/postUi'
import { pct } from '../libs/styles/pct'

interface Props {
  post: PostUi
}

const CardImage: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles({})

  return (
    <Link to={`/threads/${post.id}`}>
      <Card>
        <CardActionArea className={classes.actionArea}>
          <CardMedia component="img" image={post.photoURLs[0] + '=s400'} />
        </CardActionArea>
      </Card>
    </Link>
  )
}

const useStyles = makeStyles({ actionArea: { width: pct(100) } })

export default CardImage
