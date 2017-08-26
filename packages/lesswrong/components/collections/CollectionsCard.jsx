import { Components, registerComponent} from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Link } from 'react-router';

const testCollection = {
  title: "The Core Sequences",
  id: "dummyId",
  user: {displayName: "EliezerYudkowsky"},
  summary: "Rationality: From AI to Zombies serves as a long-form introduction to formative ideas behind LessWrong, the Machine Intelligence Research Institute, the Center for Applied Rationality, and substantial parts of the effective altruist community.",
  image: "http://i.imgur.com/dVXiZtw.png",
  color: "#B1D4B4",
}

const cardTitleStyle = {
  fontSize: "20px",
  lineHeight: "120%",
};

const cardSubtitleStyle = {
  fontSize: "16px",
  lineHeight: "100%",
}

const CollectionsCard = ({collection = testCollection, big = false, float = 'none', url}) => {
  const cardContainerStyle = {display: 'flex', flexDirection: big ? 'row' : 'column'};
  const cardItemStyle = {width: big ? 'auto' : '355px', float: float};
  const cardMediaStyle = big ? {width: '335px', height: '271px'} : {order: 2, height: '90px', position: 'absolute', bottom: '20px'};
  const cardContentStyle = {borderTopColor: collection.color}


  return <div className="collection-card-item" style={cardItemStyle}>
    <Link to={url} className="collection-card-link">
      <Card className="collection-card" containerStyle={cardContainerStyle}>
        <CardMedia style={cardMediaStyle} className="collection-card-media">
          <img src={collection.image} />
        </CardMedia>
        <div className="collection-card-content" style={cardContentStyle}>
          <CardTitle
            title={collection.title}
            subtitle={"by " + collection.user.displayName}
            className="collection-card-title"
            titleStyle={cardTitleStyle}
            subtitleStyle={cardSubtitleStyle}
            />
          <CardText
            className="collection-card-text"
            >
            {collection.summary}
          </CardText>
        </div>
      </Card>
    </Link>
  </div>
}

registerComponent("CollectionsCard", CollectionsCard);
