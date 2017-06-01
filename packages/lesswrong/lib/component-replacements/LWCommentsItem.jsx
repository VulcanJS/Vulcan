import { Components, getRawComponent, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import Comments from "meteor/vulcan:comments";

import Editor, { Editable, createEmptyState } from 'ory-editor-core';

const testContent =  {
    id: '1',
    cells: [{
      rows: [
        {
          cells: [
            {
              rows: [
                {
                  cells: [
                    {
                      content: {
                        plugin: {
                          name: 'ory/editor/core/content/slate'
                        },
                        state: {
                          importFromHtml: '<h1>European? British? These ‘Brexit’ Voters Identify as English</h1>'
                        }
                      },
                      id: '9f9c6196-9bd0-4521-a4e0-8f17cac6d058'
                    }
                  ],
                  id: 'e812c170-91b6-4b4c-bc84-b759990e1177'
                }
              ],
              id: '8e9a6007-f2fd-4d29-a2c4-e21313b03b8d'
            }
          ],
          id: '39702c61-b6c2-452e-b381-d61c8aa7eeb1'
        },
        {
          cells: [
            {
              rows: [
                {
                  cells: [
                    {
                      content: {
                        plugin: {
                          name: 'ory/editor/core/content/spacer'
                        },
                        state: {
                          height: 50
                        }
                      },
                      id: 'a97fcf35-fef6-4a68-94b4-bab1a3de3af5'
                    }
                  ],
                  id: '130ddafd-8c2d-43bc-a5cf-1c8211776793'
                },
                {
                  cells: [
                    {
                      content: {
                        plugin: {
                          name: 'ory/editor/core/content/slate'
                        },
                        state: {
                          importFromHtml: '<p>Residents of the Castle Point borough of Essex in England celebrated the queen’s 90th birthday this month. Castle Point is the most ethnically English part of the United Kingdom, with nearly 80 percent describing themselves as purely English, while 95 percent are white. Credit Andrew Testa for The New York Times</p>'
                        }
                      },
                      id: '60a42cf3-4f6a-4756-bda7-ef4ad8a57424'
                    }
                  ],
                  id: 'fc750688-1491-4ef3-8d3b-6c1c918ceebc'
                }
              ],
              id: '9991da5e-02fa-47f5-a156-af197275ead4'
            },
            {
              content: {
                plugin: {
                  name: 'ory/editor/core/content/image'
                },
                state: {
                  src: 'https://static01.nyt.com/images/2016/06/16/world/16England-web1/16England-web1-master768.jpg'
                }
              },
              id: '4530a300-bf38-476f-b799-75a75f078c47'
            }
          ],
          id: '9762d816-33a7-4d37-926b-fd3ee8a1ee73'
        },
        {
          cells: [
            {
              rows: [
                {
                  cells: [
                    {
                      content: {
                        plugin: {
                          name: 'ory/editor/core/content/slate'
                        },
                        state: {
                          importFromHtml: '<p>SOUTH BENFLEET, England — The topic of the local debate was Britain’s imminent vote on whether to leave the European Union, and the discussion in this English town on the southeastern coast turned to the influx of European citizens into Britain.</p>\n<p>“Why do they all want to come here?” demanded one woman, angrily making the case for Britain to leave the bloc at the debate in South Benfleet, organized by the local council. “They want our wages and our benefits! We’re too bloody soft!”</p>\n<p>Paddy Ashdown, a former leader of the Liberal Democrats and a supporter of remaining in the European Union in the vote next Thursday, shook his head and responded with a touch of bitterness: “Well, I’ve not seen much evidence of that here.”</p>'
                        }
                      },
                      id: '43528e51-be35-4f3d-8083-7579719151a9'
                    }
                  ],
                  id: '0f5d97ec-aaab-47ce-b8bf-7053de16653d'
                }
              ],
              id: '9fb3a6c1-01dc-4a2c-b840-c725b5341a0e'
            },
            {
              rows: [
                {
                  cells: [
                    {
                      rows: [
                        {
                          cells: [
                            {
                              rows: [
                                {
                                  cells: [
                                    {
                                      inline: 'left',
                                      content: {
                                        plugin: {
                                          name: 'ory/editor/core/content/image'
                                        },
                                        state: {
                                          src: 'https://static01.nyt.com/images/2016/06/16/world/16England-web2/16England-web2-master675.jpg'
                                        }
                                      },
                                      id: '0b9f9b2d-9362-4141-b91d-f5a0d5ad9908'
                                    },
                                    {
                                      content: {
                                        plugin: {
                                          name: 'ory/editor/core/content/slate'
                                        },
                                        state: {
                                          importFromHtml: '<p>If Britain votes to leave, it will be in large part because of strong anti-Europe sentiment in much of England, the heart of the movement to divorce Britain from the Continent. Pollsters and analysts say that while Scotland and Northern Ireland are expected to vote overwhelmingly to stay in the bloc, England, far more populous, is likely to go the other way, reflecting a broad and often bluntly expressed view that English identity and values are being washed away by subordination to the bureaucrats of Brussels.</p>'
                                        }
                                      },
                                      id: 'eb4704e9-21b7-449b-bf17-cf473b420f93'
                                    }
                                  ],
                                  id: '4444ed54-1a4a-4f3c-a0a2-6d49f50207e7'
                                }
                              ],
                              id: 'e7b450ae-148a-413c-82e2-611a2ba1b16d'
                            }
                          ],
                          id: '429a5399-6b53-44f6-aa6d-112f4f7ecdc5'
                        }
                      ],
                      id: '6a7e0316-6d22-43ae-b0eb-b96bde45f58f'
                    }
                  ],
                  id: '71f7b244-3ada-4202-8711-37ac4a09b36c'
                }
              ],
              id: 'ec9fce2c-22f4-4601-8441-a01ae28e27b1'
            }
          ],
          id: '50498c14-dced-49e0-8322-4d22fb848583'
        },
        {
          cells: [
            {
              layout: {
                plugin: {
                  name: 'ory/editor/core/layout/parallax-background'
                },
                state: {
                  background: null
                }
              },
              rows: [
                {
                  cells: [
                    {
                      rows: [
                        {
                          cells: [
                            {
                              content: {
                                plugin: {
                                  name: 'ory/editor/core/content/slate'
                                },
                                state: {
                                  importFromHtml: '<p>That sense of resurgent Englishness is palpable in places like South Benfleet, in the heart of a district that is the most ethnically English part of the United Kingdom, according to the Office of National Statistics based on the 2011 census, with nearly 80 percent describing themselves as purely English, while 95 percent are white. They are older than the national average, and only about one-quarter of 1 percent are foreign nationals, very low compared with the rest of Britain.</p>'
                                }
                              },
                              id: '219bc340-cf16-4a93-a471-1aad52ffa651'
                            },
                            {
                              content: {
                                plugin: {
                                  name: 'ory/editor/core/content/slate'
                                },
                                state: {
                                  importFromHtml: '<p>Castle Point district of Essex, full of people who have made it out of London’s tough East End to a kind of English paradise with lots of single-family homes, lawns, beaches, seaside amusement parks and fish-and-chip shops.</p>'
                                }
                              },
                              id: 'd3f7fdd9-45f1-49e4-81c7-d005ecf796e0'
                            },
                            {
                              content: {
                                plugin: {
                                  name: 'ory/editor/core/content/slate'
                                },
                                state: {
                                  importFromHtml: '<p>The people here are fiercely English, fiercely Conservative and fiercely pro-Brexit, as the possible exit is being called, and many feel that their sovereignty and identity are being diluted by a failing European Union and an “uncontrolled” influx of foreigners.</p>'
                                }
                              },
                              id: '58d1bba0-0adc-41a2-afee-22cb571e8fc2'
                            }
                          ],
                          id: 'f452db55-20a8-4d62-91c2-be1e03113317'
                        }
                      ],
                      id: 'd535b2c2-2c98-487c-ae29-370158219b51'
                    }
                  ],
                  id: '3de62493-e1da-454a-bd1d-1e666294405c'
                }
              ],
              id: 'a32d1eb5-a63b-40d9-b852-72e381a7e3aa'
            }
          ],
          id: '4dd3e3c9-e708-4463-8a71-6965964ef0b3'
        }
      ],
      id: '93f330d6-867f-4da5-9e94-40abd11114b9'
    }]
  };



class LWCommentsItem extends getRawComponent('CommentsItem') {

  render() {
    const comment = this.props.comment;

    return (
      <div className="comments-item" id={comment._id}>
        <div className="comments-item-body">
          <div className="comments-item-meta">
            <div className="comments-item-vote">
              <Components.Vote collection={Comments} document={this.props.comment} currentUser={this.props.currentUser}/>
            </div>
            <Components.UsersAvatar size="small" user={comment.user}/>
            <Components.UsersName user={comment.user}/>
            <div className="comments-item-date"><FormattedRelative value={comment.postedAt}/></div>
            <Components.ShowIf check={Comments.options.mutations.edit.check} document={this.props.comment}>
              <div>
                <a className="comment-edit" onClick={this.showEdit}><FormattedMessage id="comments.edit"/></a>
              </div>
            </Components.ShowIf>
            <Components.SubscribeTo document={comment} />
          </div>
          {this.state.showEdit ? this.renderEdit() : this.renderComment()}
        </div>
        {this.state.showReply ? this.renderReply() : null}
      </div>
    )
  }

  renderComment() {
    let content = this.props.comment.content;

    const htmlBody = {__html: this.props.comment.htmlBody};
    const showReplyButton = !this.props.comment.isDeleted && !!this.props.currentUser;

    return (
      <div className="comments-item-text">
        {content ? <Components.ContentRenderer state={content} /> :
        null}
        {htmlBody ? <div className="comment-body" dangerouslySetInnerHTML={htmlBody}></div> : null}
        { showReplyButton ?
          <a className="comments-item-reply-link" onClick={this.showReply}>
            <Components.Icon name="reply"/> <FormattedMessage id="comments.reply"/>
          </a> : null}
      </div>
    )
  }

}

replaceComponent('CommentsItem', LWCommentsItem);
