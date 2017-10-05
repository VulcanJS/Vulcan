import { makeVoteable, addVoteType } from 'meteor/vulcan:voting';
import Movies from './movies/index.js';

makeVoteable(Movies);

addVoteType('angry',    {   power: -1,    exclusive: false});
addVoteType('sad',      {   power: -1,    exclusive: false});
addVoteType('happy',    {   power: 1,     exclusive: false});
addVoteType('laughing', {   power: 1,     exclusive: false});
